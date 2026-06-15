/*
 * English Module — Type definitions
 * Persistence: Dexie (IndexedDB) via english_storage.ts — same pattern as SAT sessions.
 * Questions: static seed in english_data.ts (Option A — offline, deterministic).
 * Scoring: ceiling-with-foundation algorithm (english_scoring.ts).
 * Listening/Speaking/Writing: out of scope for v1.
 * TODO adaptive: english_scoring.ts has a note for future adaptive placement upgrade.
 */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Skill = 'grammar' | 'vocabulary' | 'reading';
export type QuestionType = 'multiple_choice' | 'gap_fill' | 'reading_comprehension';

export interface Question {
  id: string;
  level: CEFRLevel;
  skill: Skill;
  type: QuestionType;
  prompt: string;
  passage?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags?: string[];
}

export interface PlacementAnswer {
  questionId: string;
  chosenIndex: number; // -1 when user clicked "Não sei"
  correct: boolean;
  dontKnow?: boolean;
}

export interface PlacementResult {
  cefrLevel: CEFRLevel;
  takenAt: string;
  perSkillAccuracy: Record<Skill, number>;
  rawAnswers: PlacementAnswer[];
}

export interface Lesson {
  id: string;
  level: CEFRLevel;
  title: string;
  description: string;
  questionIds: string[];
}

export interface LessonStatus {
  completed: boolean;
  bestScore: number;
  completedAt?: string;
}

export interface UserEnglishProgress {
  userId: string;
  placement: PlacementResult | null;
  placementCompleted: boolean;
  currentLevel: CEFRLevel | null;
  lessonStatus: Record<string, LessonStatus>;
  xp: number;
  streak: { count: number; lastStudyDate: string };
  updatedAt: string;
}
