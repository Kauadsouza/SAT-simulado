// ─── Question Bank Types ──────────────────────────────────────────────────────

export type Section = 'reading_writing' | 'math';

export type RWDomain =
  | 'craft_and_structure'
  | 'information_and_ideas'
  | 'standard_english_conventions'
  | 'expression_of_ideas';

export type MathDomain =
  | 'algebra'
  | 'advanced_math'
  | 'problem_solving_data_analysis'
  | 'geometry_trigonometry';

export type Domain = RWDomain | MathDomain;

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple_choice' | 'spr';
export type Tier = 'easy' | 'medium' | 'hard'; // exam mode tier

export interface TranslationData {
  words?: Record<string, string>; // "word" -> "tradução"
  passage_pt?: string;
  prompt_pt?: string;
  choices_pt?: string[];
}

export interface Question {
  id: string;
  section: Section;
  domain: Domain;
  skill: string;
  difficulty: Difficulty;
  type: QuestionType;
  passage?: string;
  prompt: string;
  choices?: string[]; // A=0, B=1, C=2, D=3
  answer: string;     // "A"|"B"|"C"|"D" for MC, numeric string for SPR
  explanation: string;
  translation?: TranslationData;
}

// ─── Exam Engine Types ────────────────────────────────────────────────────────

export type ModuleId = 'rw1' | 'rw2' | 'math1' | 'math2';
export type ExamPhase =
  | 'idle'
  | 'rw1'
  | 'break'
  | 'rw2'
  | 'math1'
  | 'math2_easy'
  | 'math2_hard'
  | 'complete';

export interface ModuleInfo {
  id: ModuleId;
  section: Section;
  module: 1 | 2;
  label: string;
  questionCount: 27 | 22;
  durationSec: number; // 32*60 or 35*60
}

export interface QuestionState {
  questionId: string;
  selectedAnswer: string | null; // "A"|"B"|"C"|"D" or typed string for SPR
  markedForReview: boolean;
  dontKnow?: boolean;             // user flagged "Não sei"
  eliminated: boolean[];          // per choice (length 4, all false for SPR)
  highlighted: number[][];        // passage highlight ranges [start, end]
  timeSpentSec: number;
}

export interface ModuleResult {
  moduleId: ModuleId;
  questions: Question[];
  states: QuestionState[];
  startTime: number;   // Date.now()
  endTime: number | null;
  correctCount: number;
  totalCount: number;
  routedDifficult?: boolean; // only for mod2
}

export interface ExamSession {
  id: string; // uuid
  userId: string; // user name
  mode: Tier;
  phase: ExamPhase;
  startedAt: number;
  completedAt: number | null;
  modules: Partial<Record<ModuleId, ModuleResult>>;
  rwMod1Difficult: boolean; // routing flag
  mathMod1Difficult: boolean;
  breakStartTime: number | null;
  // Final scores
  rwRaw: number | null;
  mathRaw: number | null;
  rwScaled: number | null;
  mathScaled: number | null;
  totalScaled: number | null;
}

// ─── Scoring Types ────────────────────────────────────────────────────────────

export interface DomainBreakdown {
  domain: Domain;
  correct: number;
  total: number;
  pct: number;
}

export interface ExamResult {
  sessionId: string;
  userId: string;
  mode: Tier;
  completedAt: number;
  rwScaled: number;
  mathScaled: number;
  totalScaled: number;
  rwDomains: DomainBreakdown[];
  mathDomains: DomainBreakdown[];
  modules: Partial<Record<ModuleId, ModuleResult>>;
}

// ─── UI / App Types ───────────────────────────────────────────────────────────

export interface AppUser {
  name: string;
}
