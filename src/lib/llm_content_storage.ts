/** Per-day content cache — generated content is fixed for the day it was created, never regenerated on reload. */
import { db } from '../db/index';
import type { CEFRLevel } from './english_types';

export async function getCachedContent<T>(userId: string, date: string, blockId: string): Promise<T | undefined> {
  const record = await db.generatedContent.get([userId, date, blockId]);
  return record?.content as T | undefined;
}

export async function setCachedContent<T>(userId: string, date: string, blockId: string, cefr: CEFRLevel, content: T): Promise<void> {
  await db.generatedContent.put({ userId, date, blockId, cefr, content, createdAt: new Date().toISOString() });
}
