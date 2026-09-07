import type { CEFRLevel } from './english_types';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GeneratedContentRecord<T = unknown> {
  userId: string;
  date: string; // ISO day
  blockId: string;
  cefr: CEFRLevel;
  content: T;
  createdAt: string;
}
