/**
 * Generic spaced-repetition engine (simplified SM-2 / Anki-style).
 * Not English-specific — any item type can be scheduled with this.
 */
import type { CEFRLevel } from './english_types';

export type SrsItemType = 'word' | 'chunk' | 'sentence';
export type SrsGrade = 'again' | 'hard' | 'good' | 'easy';

export interface SrsCard {
  id: string;
  userId: string;
  type: SrsItemType;
  front: string; // EN
  back: string; // PT
  example: string; // EN sentence using the item in context
  examplePt?: string;
  audioUrl?: string;
  cefr: CEFRLevel;
  tags: string[];
  interval: number; // days
  ease: number; // ease factor, floor 1.3, starts at 2.5
  reps: number; // consecutive passes since last lapse
  lapses: number;
  dueDate: string; // ISO date (yyyy-mm-dd)
  createdAt: string;
}

const MIN_EASE = 1.3;
export const MASTERED_INTERVAL_DAYS = 21;

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function newSrsCard(input: Omit<SrsCard, 'interval' | 'ease' | 'reps' | 'lapses' | 'dueDate' | 'createdAt'>, now = new Date()): SrsCard {
  return {
    ...input,
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    dueDate: toISODate(now),
    createdAt: now.toISOString(),
  };
}

/** Pure scheduling function — does not mutate the input card. */
export function scheduleSrsCard(card: SrsCard, grade: SrsGrade, now = new Date()): SrsCard {
  if (grade === 'again') {
    return {
      ...card,
      reps: 0,
      lapses: card.lapses + 1,
      ease: Math.max(MIN_EASE, card.ease - 0.2),
      interval: 1,
      dueDate: toISODate(addDays(now, 1)),
    };
  }

  const reps = card.reps + 1;
  let interval: number;
  if (reps === 1) interval = 1;
  else if (reps === 2) interval = 6;
  else interval = Math.round(card.interval * card.ease);

  let ease = card.ease;
  if (grade === 'hard') {
    interval = Math.max(1, Math.round(interval * 0.8));
    ease = Math.max(MIN_EASE, ease - 0.15);
  } else if (grade === 'easy') {
    interval = Math.round(interval * 1.3);
    ease = ease + 0.15;
  }

  return {
    ...card,
    reps,
    ease,
    interval,
    dueDate: toISODate(addDays(now, interval)),
  };
}

export function isDue(card: SrsCard, now = new Date()): boolean {
  return card.dueDate <= toISODate(now);
}

export function isMastered(card: SrsCard): boolean {
  return card.interval >= MASTERED_INTERVAL_DAYS;
}
