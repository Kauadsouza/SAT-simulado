import { create } from 'zustand';
import type {
  ExamSession,
  ModuleId,
  ModuleResult,
  QuestionState,
  Question,
  Tier,
  ExamPhase,
} from '../lib/types';
import { buildModule } from '../data/index';
import { isRoutedDifficult, gradeAnswer, calcRWScaled, calcMathScaled } from '../lib/scoring';
import { ingestExamSession } from '../lib/review_store';
import { db } from '../db/index';

// Simple UUID without the crypto module (browser-compatible)
function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

interface ExamStore {
  session: ExamSession | null;
  // Current module live state
  currentModuleId: ModuleId | null;
  currentQuestionIndex: number;
  timeRemainingSec: number;
  timerHidden: boolean;
  // Actions
  startExam: (userId: string, mode: Tier) => void;
  advancePhase: () => Promise<void>;
  setAnswer: (questionId: string, answer: string) => void;
  toggleMarkForReview: (questionId: string) => void;
  setDontKnow: (questionId: string) => void;
  toggleEliminate: (questionId: string, choiceIndex: number) => void;
  toggleHighlight: (questionId: string, start: number, end: number) => void;
  setCurrentQuestion: (index: number) => void;
  tickTimer: () => void;
  toggleTimerHidden: () => void;
  completeCurrentModule: () => Promise<void>;
  skipBreak: () => void;
  abandonExam: () => Promise<void>;
  loadSession: (session: ExamSession) => void;
  getCurrentModuleQuestions: () => Question[];
  getCurrentModuleStates: () => QuestionState[];
}

function makeQuestionStates(questions: Question[]): QuestionState[] {
  return questions.map((q) => ({
    questionId: q.id,
    selectedAnswer: null,
    markedForReview: false,
    eliminated: [false, false, false, false],
    highlighted: [],
    timeSpentSec: 0,
  }));
}

function scoreModule(questions: Question[], states: QuestionState[]): number {
  let correct = 0;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const s = states[i];
    if (gradeAnswer(q.type, s.selectedAnswer, q.answer)) correct++;
  }
  return correct;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  session: null,
  currentModuleId: null,
  currentQuestionIndex: 0,
  timeRemainingSec: 0,
  timerHidden: false,

  startExam: (userId, mode) => {
    const usedIds = new Set<string>();
    const rw1Qs = buildModule('reading_writing', 1, mode, false, usedIds);

    const sessionId = makeId();
    const now = Date.now();

    const rw1Result: ModuleResult = {
      moduleId: 'rw1',
      questions: rw1Qs,
      states: makeQuestionStates(rw1Qs),
      startTime: now,
      endTime: null,
      correctCount: 0,
      totalCount: rw1Qs.length,
    };

    const session: ExamSession = {
      id: sessionId,
      userId,
      mode,
      phase: 'rw1',
      startedAt: now,
      completedAt: null,
      modules: { rw1: rw1Result },
      rwMod1Difficult: false,
      mathMod1Difficult: false,
      breakStartTime: null,
      rwRaw: null,
      mathRaw: null,
      rwScaled: null,
      mathScaled: null,
      totalScaled: null,
    };

    set({
      session,
      currentModuleId: 'rw1',
      currentQuestionIndex: 0,
      timeRemainingSec: 32 * 60,
      timerHidden: false,
    });

    // Persist to IndexedDB
    db.sessions.put(session);
  },

  loadSession: (session) => {
    // Determine current module and remaining time from saved session
    const phase = session.phase;
    let currentModuleId: ModuleId | null = null;
    let timeRemainingSec = 0;

    if (phase === 'rw1') { currentModuleId = 'rw1'; timeRemainingSec = 32 * 60; }
    else if (phase === 'rw2') { currentModuleId = 'rw2'; timeRemainingSec = 32 * 60; }
    else if (phase === 'math1') { currentModuleId = 'math1'; timeRemainingSec = 35 * 60; }
    else if (phase === 'math2_easy' || phase === 'math2_hard') {
      currentModuleId = 'math2'; timeRemainingSec = 35 * 60;
    }

    set({
      session,
      currentModuleId,
      currentQuestionIndex: 0,
      timeRemainingSec,
      timerHidden: false,
    });
  },

  completeCurrentModule: async () => {
    const { session, currentModuleId } = get();
    if (!session || !currentModuleId) return;

    const moduleResult = session.modules[currentModuleId];
    if (!moduleResult) return;

    const correctCount = scoreModule(moduleResult.questions, moduleResult.states);
    const updatedModule: ModuleResult = {
      ...moduleResult,
      endTime: Date.now(),
      correctCount,
    };

    let nextPhase: ExamPhase = session.phase;
    let nextModuleId: ModuleId | null = null;
    let nextTimeSec = 0;
    let updatedSession = { ...session };
    updatedSession.modules = { ...session.modules, [currentModuleId]: updatedModule };

    if (currentModuleId === 'rw1') {
      // Score mod1, route mod2
      const difficult = isRoutedDifficult(correctCount, moduleResult.questions.length, session.mode);
      const usedIds = new Set(moduleResult.questions.map((q) => q.id));
      const rw2Qs = buildModule('reading_writing', 2, session.mode, difficult, usedIds);
      const rw2Result: ModuleResult = {
        moduleId: 'rw2',
        questions: rw2Qs,
        states: makeQuestionStates(rw2Qs),
        startTime: Date.now(),
        endTime: null,
        correctCount: 0,
        totalCount: rw2Qs.length,
        routedDifficult: difficult,
      };
      updatedSession.rwMod1Difficult = difficult;
      updatedSession.modules = { ...updatedSession.modules, rw2: rw2Result };
      nextPhase = 'rw2';
      nextModuleId = 'rw2';
      nextTimeSec = 32 * 60;

    } else if (currentModuleId === 'rw2') {
      // RW done — go to break
      nextPhase = 'break';
      nextModuleId = null;
      nextTimeSec = 10 * 60;
      updatedSession.breakStartTime = Date.now();
      // Calculate RW raw
      const rw1 = updatedSession.modules.rw1!;
      const rw2 = updatedModule;
      updatedSession.rwRaw = rw1.correctCount + rw2.correctCount;

    } else if (currentModuleId === 'math1') {
      // Score math mod1, route math mod2
      const difficult = isRoutedDifficult(correctCount, moduleResult.questions.length, session.mode);
      const usedIds = new Set(moduleResult.questions.map((q) => q.id));
      const math2Qs = buildModule('math', 2, session.mode, difficult, usedIds);
      const math2Result: ModuleResult = {
        moduleId: 'math2',
        questions: math2Qs,
        states: makeQuestionStates(math2Qs),
        startTime: Date.now(),
        endTime: null,
        correctCount: 0,
        totalCount: math2Qs.length,
        routedDifficult: difficult,
      };
      updatedSession.mathMod1Difficult = difficult;
      updatedSession.modules = { ...updatedSession.modules, math2: math2Result };
      nextPhase = difficult ? 'math2_hard' : 'math2_easy';
      nextModuleId = 'math2';
      nextTimeSec = 35 * 60;

    } else if (currentModuleId === 'math2') {
      // Exam complete
      const math1 = updatedSession.modules.math1!;
      const math2 = updatedModule;
      const mathRaw = math1.correctCount + math2.correctCount;
      const rwRaw = updatedSession.rwRaw ?? 0;
      const rwScaled = calcRWScaled(rwRaw, updatedSession.rwMod1Difficult);
      const mathScaled = calcMathScaled(mathRaw, updatedSession.mathMod1Difficult);
      updatedSession.mathRaw = mathRaw;
      updatedSession.rwScaled = rwScaled;
      updatedSession.mathScaled = mathScaled;
      updatedSession.totalScaled = rwScaled + mathScaled;
      updatedSession.completedAt = Date.now();
      nextPhase = 'complete';
      nextModuleId = null;
      nextTimeSec = 0;
    }

    updatedSession.phase = nextPhase;

    // Persist
    await db.sessions.put(updatedSession);

    // When the simulado finishes, feed every question into the mistake bank (SRS).
    if (nextPhase === 'complete') {
      ingestExamSession(updatedSession).catch((e) =>
        console.error('Failed to ingest exam into mistake bank', e)
      );
    }

    set({
      session: updatedSession,
      currentModuleId: nextModuleId,
      currentQuestionIndex: 0,
      timeRemainingSec: nextTimeSec,
    });
  },

  advancePhase: async () => {
    const { session } = get();
    if (!session) return;
    if (session.phase === 'break') {
      // Start math1
      const usedIds = new Set<string>();
      const math1Qs = buildModule('math', 1, session.mode, false, usedIds);
      const math1Result: ModuleResult = {
        moduleId: 'math1',
        questions: math1Qs,
        states: makeQuestionStates(math1Qs),
        startTime: Date.now(),
        endTime: null,
        correctCount: 0,
        totalCount: math1Qs.length,
      };
      const updated = {
        ...session,
        phase: 'math1' as ExamPhase,
        modules: { ...session.modules, math1: math1Result },
      };
      await db.sessions.put(updated);
      set({
        session: updated,
        currentModuleId: 'math1',
        currentQuestionIndex: 0,
        timeRemainingSec: 35 * 60,
      });
    }
  },

  skipBreak: () => {
    const { advancePhase } = get();
    advancePhase();
  },

  setAnswer: (questionId, answer) => {
    const { session, currentModuleId } = get();
    if (!session || !currentModuleId) return;
    const module = session.modules[currentModuleId];
    if (!module) return;
    const updated = {
      ...session,
      modules: {
        ...session.modules,
        [currentModuleId]: {
          ...module,
          states: module.states.map((s) =>
            s.questionId === questionId ? { ...s, selectedAnswer: answer } : s
          ),
        },
      },
    };
    set({ session: updated });
    // Persist debounced (every 5 changes — simplified: always persist)
    db.sessions.put(updated);
  },

  toggleMarkForReview: (questionId) => {
    const { session, currentModuleId } = get();
    if (!session || !currentModuleId) return;
    const module = session.modules[currentModuleId];
    if (!module) return;
    const updated = {
      ...session,
      modules: {
        ...session.modules,
        [currentModuleId]: {
          ...module,
          states: module.states.map((s) =>
            s.questionId === questionId ? { ...s, markedForReview: !s.markedForReview } : s
          ),
        },
      },
    };
    set({ session: updated });
    db.sessions.put(updated);
  },

  setDontKnow: (questionId) => {
    const { session, currentModuleId } = get();
    if (!session || !currentModuleId) return;
    const module = session.modules[currentModuleId];
    if (!module) return;
    const updated = {
      ...session,
      modules: {
        ...session.modules,
        [currentModuleId]: {
          ...module,
          states: module.states.map((s) =>
            s.questionId === questionId ? { ...s, dontKnow: true, selectedAnswer: null } : s
          ),
        },
      },
    };
    set({ session: updated });
    db.sessions.put(updated);
  },

  toggleEliminate: (questionId, choiceIndex) => {
    const { session, currentModuleId } = get();
    if (!session || !currentModuleId) return;
    const module = session.modules[currentModuleId];
    if (!module) return;
    const updated = {
      ...session,
      modules: {
        ...session.modules,
        [currentModuleId]: {
          ...module,
          states: module.states.map((s) => {
            if (s.questionId !== questionId) return s;
            const elim = [...s.eliminated];
            elim[choiceIndex] = !elim[choiceIndex];
            return { ...s, eliminated: elim };
          }),
        },
      },
    };
    set({ session: updated });
    db.sessions.put(updated);
  },

  toggleHighlight: (_questionId, _start, _end) => {
    // Highlight ranges stored but rendering is complex — simplified impl
  },

  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

  tickTimer: () => {
    set((state) => {
      const remaining = state.timeRemainingSec;
      if (remaining <= 0) return state;
      return { timeRemainingSec: remaining - 1 };
    });
  },

  toggleTimerHidden: () => set((s) => ({ timerHidden: !s.timerHidden })),

  abandonExam: async () => {
    const { session } = get();
    if (session) {
      await db.sessions.delete(session.id);
    }
    set({ session: null, currentModuleId: null });
  },

  getCurrentModuleQuestions: () => {
    const { session, currentModuleId } = get();
    if (!session || !currentModuleId) return [];
    return session.modules[currentModuleId]?.questions ?? [];
  },

  getCurrentModuleStates: () => {
    const { session, currentModuleId } = get();
    if (!session || !currentModuleId) return [];
    return session.modules[currentModuleId]?.states ?? [];
  },
}));
