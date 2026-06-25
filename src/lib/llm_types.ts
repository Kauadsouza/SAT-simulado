import type { CEFRLevel } from './english_types';
import type { DailyBlockId } from './english_engine_types';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GeneratedContentRecord<T = unknown> {
  userId: string;
  date: string; // ISO day
  blockId: DailyBlockId;
  cefr: CEFRLevel;
  content: T;
  createdAt: string;
}
