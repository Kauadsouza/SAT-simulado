/** Per-day content cache — generated content is fixed for the day it was created, never regenerated on reload. */
import { db } from '../db/index';
import type { DailyBlockId } from './english_engine_types';
import type { CEFRLevel } from './english_types';

export async function getCachedContent<T>(userId: string, date: string, blockId: DailyBlockId): Promise<T | undefined> {
  const record = await db.generatedContent.get([userId, date, blockId]);
  return record?.content as T | undefined;
}

export async function setCachedContent<T>(userId: string, date: string, blockId: DailyBlockId, cefr: CEFRLevel, content: T): Promise<void> {
  await db.generatedContent.put({ userId, date, blockId, cefr, content, createdAt: new Date().toISOString() });
}
