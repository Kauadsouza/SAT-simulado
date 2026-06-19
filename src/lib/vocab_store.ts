/*
 * Vocabulary SRS deck — persistence over Dexie `vocabReview`.
 * Reuses the SM-2 engine in srs.ts. A study session mixes DUE cards (review)
 * with a capped number of brand-new words (introduction), so the deck grows
 * steadily without overwhelming the learner.
 */
import { db } from '../db/index';
import type { CEFRLevel } from './english_types';
import { VOCAB, vocabForLevel, type VocabItem } from '../data/english_vocab';
import { CEFR_ORDER } from './english_scoring';
import {
  initSrs,
  scheduleSrs,
  isMastered,
  type SrsState,
  type ReviewGrade,
} from './srs';

export interface VocabCard extends SrsState {
  userId: string;
  vocabId: string;
  level: CEFRLevel;
  attempts: number;
  correct: number;
  lastSeenAt: number;
  createdAt: number;
}

function keyOf(userId: string, vocabId: string): [string, string] {
  return [userId, vocabId];
}

export async function recordVocabReview(
  userId: string,
  item: VocabItem,
  grade: ReviewGrade,
  now: number = Date.now(),
): Promise<VocabCard> {
  const existing = await db.vocabReview.get(keyOf(userId, item.id));
  const prev: SrsState = existing ?? initSrs(now);
  const next = scheduleSrs(prev, grade, now);
  const correct = grade !== 'again';

  const card: VocabCard = {
    ...next,
    userId,
    vocabId: item.id,
    level: item.level,
    attempts: (existing?.attempts ?? 0) + 1,
    correct: (existing?.correct ?? 0) + (correct ? 1 : 0),
    lastSeenAt: now,
    createdAt: existing?.createdAt ?? now,
  };
  await db.vocabReview.put(card);
  return card;
}

export async function getAllVocabCards(userId: string): Promise<VocabCard[]> {
  return db.vocabReview.where('userId').equals(userId).toArray();
}

export interface VocabStats {
  total: number;       // distinct words seen
  dueCount: number;
  mastered: number;
  newAvailable: number; // words never studied yet (at/below user level)
}

export async function getVocabStats(
  userId: string,
  userLevel: CEFRLevel | null,
  now: number = Date.now(),
): Promise<VocabStats> {
  const cards = await getAllVocabCards(userId);
  const seen = new Set(cards.map((c) => c.vocabId));
  const pool = poolForLevel(userLevel);
  return {
    total: cards.length,
    dueCount: cards.filter((c) => c.due <= now).length,
    mastered: cards.filter((c) => isMastered(c)).length,
    newAvailable: pool.filter((v) => !seen.has(v.id)).length,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Random sample of vocab items (used for listening/speaking sentence practice). */
export function sampleSentences(userLevel: CEFRLevel | null, n = 6): VocabItem[] {
  return shuffle(poolForLevel(userLevel)).slice(0, n);
}

/** Words at the user's level and everything below it (foundation included). */
function poolForLevel(userLevel: CEFRLevel | null): VocabItem[] {
  if (!userLevel) return VOCAB;
  const maxIdx = CEFR_ORDER.indexOf(userLevel);
  const allowed = new Set(CEFR_ORDER.slice(0, maxIdx + 1));
  const pool = VOCAB.filter((v) => allowed.has(v.level));
  return pool.length ? pool : VOCAB;
}

/**
 * Build a study queue: all DUE cards first (soonest due), then fill with new,
 * never-seen words up to `size`. Returns the VocabItems to study, in order.
 */
export async function buildVocabSession(
  userId: string,
  userLevel: CEFRLevel | null,
  size = 12,
  maxNew = 8,
  now: number = Date.now(),
): Promise<{ items: VocabItem[]; dueCount: number; newCount: number }> {
  const cards = await getAllVocabCards(userId);
  const byId = new Map(cards.map((c) => [c.vocabId, c]));

  const due = cards
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due)
    .map((c) => VOCAB.find((v) => v.id === c.vocabId))
    .filter((v): v is VocabItem => !!v);

  const pool = poolForLevel(userLevel);
  // Prefer new words at the user's own level first, then easier ones.
  const order = userLevel ? vocabForLevel(userLevel) : [];
  const rest = pool.filter((v) => !order.includes(v));
  const newWords = [...order, ...rest].filter((v) => !byId.has(v.id));

  const dueSlice = due.slice(0, size);
  const remaining = Math.max(0, size - dueSlice.length);
  const newSlice = newWords.slice(0, Math.min(maxNew, remaining));

  return {
    items: [...dueSlice, ...newSlice],
    dueCount: dueSlice.length,
    newCount: newSlice.length,
  };
}
