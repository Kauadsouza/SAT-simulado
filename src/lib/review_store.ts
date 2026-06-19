/*
 * Mistake bank (Caderno de Erros) — persistence layer over Dexie `reviewItems`.
 *
 * Every attempted question becomes a spaced-repetition card. Wrong answers are
 * scheduled to return soon; correct ones drift further out. This is the single
 * highest-leverage study loop for getting to 1600: you stop re-studying what you
 * already know and concentrate on what you keep missing.
 */
import { db } from '../db/index';
import type { Question, Section, Domain, ExamSession } from './types';
import {
  initSrs,
  scheduleSrs,
  isMastered,
  type ReviewItem,
  type ReviewGrade,
  type ReviewSource,
} from './srs';
import { gradeAnswer } from './scoring';

function keyOf(userId: string, questionId: string): [string, string] {
  return [userId, questionId];
}

/**
 * Record one attempt at a question, creating or updating its SRS card.
 * `grade` defaults to correctness-based ('good' if correct, 'again' if not),
 * but a self-rating ('hard' | 'easy') can be passed for correct answers.
 */
export async function recordReview(
  userId: string,
  q: Question,
  correct: boolean,
  source: ReviewSource = 'drill',
  grade?: ReviewGrade,
  now: number = Date.now(),
): Promise<ReviewItem> {
  const existing = await db.reviewItems.get(keyOf(userId, q.id));
  const effectiveGrade: ReviewGrade = grade ?? (correct ? 'good' : 'again');

  const prevState = existing ?? { ...initSrs(now) };
  const nextState = scheduleSrs(prevState, effectiveGrade, now);

  const item: ReviewItem = {
    ...nextState,
    userId,
    questionId: q.id,
    section: q.section,
    domain: q.domain,
    skill: q.skill,
    difficulty: q.difficulty,
    attempts: (existing?.attempts ?? 0) + 1,
    correctCount: (existing?.correctCount ?? 0) + (correct ? 1 : 0),
    lastCorrect: correct,
    lastSeenAt: now,
    createdAt: existing?.createdAt ?? now,
    source: existing?.source ?? source,
  };

  await db.reviewItems.put(item);
  return item;
}

/** All cards for a user. */
export async function getAllReviewItems(userId: string): Promise<ReviewItem[]> {
  return db.reviewItems.where('userId').equals(userId).toArray();
}

/** Cards due for review now, soonest first. Optionally filter by section. */
export async function getDueReviewItems(
  userId: string,
  now: number = Date.now(),
  section?: Section,
): Promise<ReviewItem[]> {
  const items = await db.reviewItems.where('userId').equals(userId).toArray();
  return items
    .filter((i) => i.due <= now && (!section || i.section === section))
    .sort((a, b) => a.due - b.due);
}

export interface SkillStat {
  key: string;
  section: Section;
  attempts: number;
  correct: number;
  accuracy: number; // 0–100
}

export interface ReviewStats {
  total: number;
  dueCount: number;
  mastered: number;
  struggling: number; // last attempt wrong
  perSkill: SkillStat[];
  perDomain: SkillStat[];
}

export async function getReviewStats(
  userId: string,
  now: number = Date.now(),
): Promise<ReviewStats> {
  const items = await getAllReviewItems(userId);

  const skillMap = new Map<string, SkillStat>();
  const domainMap = new Map<string, SkillStat>();

  let dueCount = 0;
  let mastered = 0;
  let struggling = 0;

  for (const it of items) {
    if (it.due <= now) dueCount++;
    if (isMastered(it)) mastered++;
    if (!it.lastCorrect) struggling++;

    const sk = skillMap.get(it.skill) ?? {
      key: it.skill, section: it.section, attempts: 0, correct: 0, accuracy: 0,
    };
    sk.attempts += it.attempts;
    sk.correct += it.correctCount;
    skillMap.set(it.skill, sk);

    const dm = domainMap.get(it.domain) ?? {
      key: it.domain, section: it.section, attempts: 0, correct: 0, accuracy: 0,
    };
    dm.attempts += it.attempts;
    dm.correct += it.correctCount;
    domainMap.set(it.domain, dm);
  }

  const finalize = (m: Map<string, SkillStat>) =>
    [...m.values()]
      .map((s) => ({ ...s, accuracy: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0 }))
      .sort((a, b) => a.accuracy - b.accuracy);

  return {
    total: items.length,
    dueCount,
    mastered,
    struggling,
    perSkill: finalize(skillMap),
    perDomain: finalize(domainMap),
  };
}

/**
 * Feed every question of a finished simulado into the mistake bank.
 * Idempotent enough for our needs: re-ingesting simply re-grades the cards.
 */
export async function ingestExamSession(session: ExamSession): Promise<void> {
  const now = Date.now();
  for (const mod of Object.values(session.modules)) {
    if (!mod) continue;
    for (let i = 0; i < mod.questions.length; i++) {
      const q = mod.questions[i];
      const st = mod.states[i];
      const correct = gradeAnswer(q.type, st.selectedAnswer, q.answer);
      await recordReview(session.userId, q, correct, 'exam', undefined, now);
    }
  }
}

/** Map a list of review items back to their full Question objects. */
export function itemsToQuestions(items: ReviewItem[], bank: Question[]): Question[] {
  const byId = new Map(bank.map((q) => [q.id, q]));
  return items.map((it) => byId.get(it.questionId)).filter((q): q is Question => !!q);
}

export type { ReviewItem, Domain };
