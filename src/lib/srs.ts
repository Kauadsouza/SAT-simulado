/*
 * Spaced-Repetition engine (SM-2, the SuperMemo / Anki algorithm).
 *
 * This is the backbone of the "Caderno de Erros" (mistake bank): every question
 * the user attempts — in a full simulado OR a drill — becomes a ReviewItem that
 * is scheduled for future review. Questions you miss come back soon; questions
 * you nail get pushed further out, so study time concentrates on weak spots.
 *
 * The same engine is reused by the English module (vocabulary / grammar items).
 */
import type { Section, Domain, Difficulty } from './types';

// ─── Grading ──────────────────────────────────────────────────────────────────
// Anki-style 4-button grading. In an auto-graded drill we map:
//   wrong answer            → 'again'
//   right answer (default)  → 'good'
//   right + self-rated      → 'hard' | 'good' | 'easy'
export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

const QUALITY: Record<ReviewGrade, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

export const DAY_MS = 24 * 60 * 60 * 1000;
// An item whose interval has grown past this is considered "dominado" (mastered).
export const MASTERED_INTERVAL_DAYS = 21;

// SM-2 mutable scheduling state.
export interface SrsState {
  ease: number;     // ease factor, starts 2.5, floor 1.3
  interval: number; // days until next review
  reps: number;     // number of consecutive successful reviews
  lapses: number;   // times the item was forgotten after being learned
  due: number;      // timestamp (ms) when the item becomes due
}

export function initSrs(now: number = Date.now()): SrsState {
  return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now };
}

/**
 * Apply one review to an SRS state and return the updated state.
 * Pure function — does not mutate its input.
 */
export function scheduleSrs(
  state: SrsState,
  grade: ReviewGrade,
  now: number = Date.now(),
): SrsState {
  const q = QUALITY[grade];
  let { ease, interval, reps, lapses } = state;

  if (q < 3) {
    // Lapse: forgot it. Reset reps, schedule for tomorrow.
    reps = 0;
    if (state.reps > 0 || state.interval > 0) lapses += 1;
    interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ease);
  }

  // Update ease factor (SM-2 formula). Easier grades raise it, hard ones lower it.
  ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ease < 1.3) ease = 1.3;

  return {
    ease,
    interval,
    reps,
    lapses,
    due: now + interval * DAY_MS,
  };
}

export function isDue(state: SrsState, now: number = Date.now()): boolean {
  return state.due <= now;
}

export function isMastered(state: SrsState): boolean {
  return state.interval >= MASTERED_INTERVAL_DAYS;
}

// ─── Review item (one card in the mistake bank) ─────────────────────────────────
export type ReviewSource = 'exam' | 'drill' | 'review';

export interface ReviewItem extends SrsState {
  // Compound primary key in Dexie: [userId+questionId]
  userId: string;
  questionId: string;
  // Denormalised question metadata so we can build analytics without joining.
  section: Section;
  domain: Domain;
  skill: string;
  difficulty: Difficulty;
  // Lifetime stats
  attempts: number;
  correctCount: number;
  lastCorrect: boolean;
  lastSeenAt: number;
  createdAt: number;
  source: ReviewSource;
}
