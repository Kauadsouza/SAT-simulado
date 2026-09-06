/**
 * Persistence layer for the English daily engine (curriculum progress + SRS deck).
 * Wraps Dexie (IndexedDB) — same pattern as english_storage.ts.
 */
import { db } from '../db/index';
import type { EnglishEngineProgress, IntensityMode, DailyPlanState, DailyBlockId } from './english_engine_types';
import { getCurrentWeekNumber, getPhaseForWeek } from '../data/english_curriculum';
import { INTENSITY_BLOCKS } from '../data/english_daily_blocks';
import { type SrsCard, type SrsGrade, type SrsItemType, scheduleSrsCard, isDue, newSrsCard } from './srs';
import type { CEFRLevel } from './english_types';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultProgress(userId: string): EnglishEngineProgress {
  return {
    userId,
    startDate: null,
    intensity: 'completo',
    streak: { count: 0, lastActiveDate: '' },
    checkpoints: {},
    dailyPlans: {},
    updatedAt: new Date().toISOString(),
  };
}

export async function loadEngineProgress(userId: string): Promise<EnglishEngineProgress> {
  const record = await db.englishEngine.get(userId);
  return record ?? defaultProgress(userId);
}

export async function saveEngineProgress(progress: EnglishEngineProgress): Promise<void> {
  await db.transaction('rw', db.englishEngine, async () => {
    const latest = await db.englishEngine.get(progress.userId);
    await db.englishEngine.put({ ...progress, learningHub: latest?.learningHub ?? progress.learningHub, updatedAt: new Date().toISOString() });
  });
}

/** Sets startDate on first visit to the daily engine. Idempotent. */
export async function ensureStarted(userId: string): Promise<EnglishEngineProgress> {
  const progress = await loadEngineProgress(userId);
  if (!progress.startDate) {
    progress.startDate = todayISO();
    await saveEngineProgress(progress);
  }
  return progress;
}

export async function setIntensity(userId: string, intensity: IntensityMode): Promise<EnglishEngineProgress> {
  const progress = await loadEngineProgress(userId);
  progress.intensity = intensity;
  await saveEngineProgress(progress);
  return progress;
}

function updateStreak(streak: { count: number; lastActiveDate: string }): { count: number; lastActiveDate: string } {
  const today = todayISO();
  if (streak.lastActiveDate === today) return streak;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  return {
    count: streak.lastActiveDate === yesterday ? streak.count + 1 : 1,
    lastActiveDate: today,
  };
}

/** Returns today's plan, creating it from the curriculum + chosen intensity if it doesn't exist yet. */
export async function getOrCreateTodayPlan(userId: string): Promise<{ progress: EnglishEngineProgress; plan: DailyPlanState }> {
  const progress = await ensureStarted(userId);
  const date = todayISO();
  const existing = progress.dailyPlans[date];
  if (existing) return { progress, plan: existing };

  const weekNumber = getCurrentWeekNumber(progress.startDate!);
  const phase = getPhaseForWeek(weekNumber);
  const plan: DailyPlanState = {
    date,
    weekNumber,
    phaseId: phase.id,
    intensity: progress.intensity,
    blocks: INTENSITY_BLOCKS[progress.intensity].map((blockId) => ({ blockId, completed: false })),
  };
  progress.dailyPlans[date] = plan;
  await saveEngineProgress(progress);
  return { progress, plan };
}

/** Changes intensity for today's plan, preserving completion state of blocks that remain. Also becomes the default for future days. */
export async function setTodayIntensity(userId: string, intensity: IntensityMode): Promise<EnglishEngineProgress> {
  const progress = await ensureStarted(userId);
  progress.intensity = intensity;
  const date = todayISO();
  const prevPlan = progress.dailyPlans[date];
  const weekNumber = getCurrentWeekNumber(progress.startDate!);
  const phase = getPhaseForWeek(weekNumber);
  progress.dailyPlans[date] = {
    date,
    weekNumber,
    phaseId: phase.id,
    intensity,
    blocks: INTENSITY_BLOCKS[intensity].map((blockId) => prevPlan?.blocks.find((b) => b.blockId === blockId) ?? { blockId, completed: false }),
  };
  await saveEngineProgress(progress);
  return progress;
}

export async function toggleBlock(userId: string, date: string, blockId: DailyBlockId): Promise<EnglishEngineProgress> {
  const progress = await loadEngineProgress(userId);
  const plan = progress.dailyPlans[date];
  if (!plan) return progress;
  const block = plan.blocks.find((b) => b.blockId === blockId);
  if (!block) return progress;
  block.completed = !block.completed;
  block.completedAt = block.completed ? new Date().toISOString() : undefined;
  if (block.completed) progress.streak = updateStreak(progress.streak);
  await saveEngineProgress(progress);
  return progress;
}

// ─── SRS deck ─────────────────────────────────────────────────────────────────

export async function addSrsCards(cards: SrsCard[]): Promise<void> {
  await db.srsCards.bulkPut(cards);
}

export async function getAllSrsCards(userId: string): Promise<SrsCard[]> {
  return db.srsCards.where('userId').equals(userId).toArray();
}

export async function getDueSrsCards(userId: string, now = new Date()): Promise<SrsCard[]> {
  const cards = await getAllSrsCards(userId);
  return cards.filter((c) => isDue(c, now)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function reviewSrsCard(userId: string, cardId: string, grade: SrsGrade, now = new Date()): Promise<SrsCard | undefined> {
  const card = await db.srsCards.get([userId, cardId]);
  if (!card) return undefined;
  const updated = scheduleSrsCard(card, grade, now);
  await db.srsCards.put(updated);
  return updated;
}

/** Adds generated vocab to the SRS deck, skipping any word that already exists (case-insensitive front match). Returns how many were actually added. */
export async function mineVocabIntoSrs(
  userId: string,
  items: { front: string; back: string; example: string; cefr: CEFRLevel; tags: string[]; type?: SrsItemType }[],
  now = new Date(),
): Promise<number> {
  const existing = await getAllSrsCards(userId);
  const existingFronts = new Set(existing.map((c) => c.front.toLowerCase().trim()));
  const fresh = items.filter((i) => !existingFronts.has(i.front.toLowerCase().trim()));
  const cards = fresh.map((i, idx) =>
    newSrsCard(
      {
        id: `gen-${now.getTime()}-${idx}`,
        userId,
        type: i.type ?? 'word',
        front: i.front,
        back: i.back,
        example: i.example,
        cefr: i.cefr,
        tags: i.tags,
      },
      now,
    ),
  );
  if (cards.length) await addSrsCards(cards);
  return cards.length;
}
