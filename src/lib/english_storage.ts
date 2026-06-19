/**
 * Persistence layer for the English module — wraps Dexie (IndexedDB).
 * Swap this file's internals to move to Supabase/another DB without touching the UI.
 */
import { db } from '../db/index';
import type { UserEnglishProgress, PlacementResult, LessonStatus } from './english_types';

function defaultProgress(userId: string): UserEnglishProgress {
  return {
    userId,
    placement: null,
    placementCompleted: false,
    currentLevel: null,
    lessonStatus: {},
    xp: 0,
    streak: { count: 0, lastStudyDate: '' },
    updatedAt: new Date().toISOString(),
  };
}

export async function loadEnglishProgress(userId: string): Promise<UserEnglishProgress> {
  const record = await db.englishProgress.get(userId);
  return record ?? defaultProgress(userId);
}

export async function saveEnglishProgress(progress: UserEnglishProgress): Promise<void> {
  progress.updatedAt = new Date().toISOString();
  await db.englishProgress.put(progress);
}

export async function savePlacementResult(userId: string, result: PlacementResult): Promise<UserEnglishProgress> {
  const progress = await loadEnglishProgress(userId);
  progress.placement = result;
  progress.placementCompleted = true;
  progress.currentLevel = result.cefrLevel;
  // Update streak
  progress.streak = updateStreak(progress.streak);
  await saveEnglishProgress(progress);
  return progress;
}

export async function completeLessonForUser(
  userId: string,
  lessonId: string,
  score: number,
  xpGained: number,
): Promise<UserEnglishProgress> {
  const progress = await loadEnglishProgress(userId);
  const existing = progress.lessonStatus[lessonId];
  progress.lessonStatus[lessonId] = {
    completed: score >= 0.7,
    bestScore: Math.max(score, existing?.bestScore ?? 0),
    completedAt: score >= 0.7 ? new Date().toISOString() : existing?.completedAt,
  } as LessonStatus;
  if (score >= 0.7) progress.xp += xpGained;
  progress.streak = updateStreak(progress.streak);
  await saveEnglishProgress(progress);
  return progress;
}

/** Award XP and bump the daily streak — used by the vocab/listening/speaking trainers. */
export async function addXpAndStreak(userId: string, xp: number): Promise<UserEnglishProgress> {
  const progress = await loadEnglishProgress(userId);
  progress.xp += Math.max(0, Math.round(xp));
  progress.streak = updateStreak(progress.streak);
  await saveEnglishProgress(progress);
  return progress;
}

export async function resetPlacement(userId: string): Promise<UserEnglishProgress> {
  const progress = await loadEnglishProgress(userId);
  progress.placement = null;
  progress.placementCompleted = false;
  progress.currentLevel = null;
  progress.lessonStatus = {};
  progress.xp = 0;
  await saveEnglishProgress(progress);
  return progress;
}

function updateStreak(streak: { count: number; lastStudyDate: string }): { count: number; lastStudyDate: string } {
  const today = new Date().toDateString();
  const last = streak.lastStudyDate;
  if (last === today) return streak; // already studied today
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return {
    count: last === yesterday ? streak.count + 1 : 1,
    lastStudyDate: today,
  };
}
