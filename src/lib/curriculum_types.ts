import type { CEFRLevel } from './english_types';

export type PhaseId = 1 | 2 | 3 | 4;

export interface CurriculumPhase {
  id: PhaseId;
  label: string;
  weekStart: number;
  weekEnd: number;
  cefrFrom: CEFRLevel;
  cefrTo: CEFRLevel;
  focus: string;
  coreGrammar: string[];
  vocabTarget: number; // cumulative lemmas by end of phase
  canDo: string[];
}

export interface WeekInfo {
  weekNumber: number; // 1-26
  phase: CurriculumPhase;
  isCheckpoint: boolean;
}
