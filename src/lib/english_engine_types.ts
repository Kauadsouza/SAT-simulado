import type { CEFRLevel } from './english_types';
import type { LearningHubState } from './learning-hub';

export type IntensityMode = 'lite' | 'completo' | 'intensivo';

export type DailyBlockId =
  | 'srs_review'
  | 'listening'
  | 'reading'
  | 'grammar_focus'
  | 'vocab_chunks'
  | 'output_speaking'
  | 'task'
  | 'extra_input'
  | 'conversation';

export interface DailyBlockState {
  blockId: DailyBlockId;
  completed: boolean;
  completedAt?: string;
}

export interface DailyPlanState {
  date: string; // ISO yyyy-mm-dd
  weekNumber: number;
  phaseId: 1 | 2 | 3 | 4;
  intensity: IntensityMode;
  blocks: DailyBlockState[];
}

export interface CheckpointResult {
  weekNumber: number;
  takenAt: string;
  cefrEstimate: CEFRLevel;
  notes?: string;
}

export interface EnglishEngineProgress {
  learningHub?: LearningHubState;
  userId: string;
  startDate: string | null; // ISO date, set on first visit to the daily engine
  intensity: IntensityMode;
  streak: { count: number; lastActiveDate: string };
  checkpoints: Record<number, CheckpointResult>; // keyed by week number
  dailyPlans: Record<string, DailyPlanState>; // keyed by date
  updatedAt: string;
}
