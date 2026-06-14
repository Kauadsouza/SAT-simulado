import type { Question, Section, Tier, Domain, Difficulty } from '../lib/types';
import RW_QUESTIONS from './questions_rw';
import MATH_QUESTIONS from './questions_math';

export const ALL_QUESTIONS: Question[] = [...RW_QUESTIONS, ...MATH_QUESTIONS];

// ─── Domain distribution targets (per module) ────────────────────────────────
// RW per module (27 questions): C&S ~28%, I&I ~26%, SEC ~26%, EoI ~20%
const RW_DOMAIN_TARGETS: Record<Domain, number> = {
  craft_and_structure: 7,
  information_and_ideas: 7,
  standard_english_conventions: 7,
  expression_of_ideas: 6,
  // Math domains (not used for RW)
  algebra: 0,
  advanced_math: 0,
  problem_solving_data_analysis: 0,
  geometry_trigonometry: 0,
};
// Math per module (22 questions): Alg ~35%, AdvMath ~35%, PSDA ~15%, G&T ~15%
const MATH_DOMAIN_TARGETS: Record<Domain, number> = {
  algebra: 8,
  advanced_math: 8,
  problem_solving_data_analysis: 3,
  geometry_trigonometry: 3,
  craft_and_structure: 0,
  information_and_ideas: 0,
  standard_english_conventions: 0,
  expression_of_ideas: 0,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type DifficultyDist = { easy: number; medium: number; hard: number };

function pickByDomain(
  pool: Question[],
  domainTargets: Partial<Record<Domain, number>>,
  diffDist: DifficultyDist,
  usedIds: Set<string>
): Question[] {
  const result: Question[] = [];

  for (const [domain, count] of Object.entries(domainTargets)) {
    if (!count) continue;
    const available = pool.filter(
      (q) => q.domain === domain && !usedIds.has(q.id)
    );
    // Try to satisfy difficulty distribution proportionally
    const easyTarget = Math.round((diffDist.easy / 27) * count);
    const hardTarget = Math.round((diffDist.hard / 27) * count);
    const medTarget = count - easyTarget - hardTarget;

    const easy = shuffle(available.filter((q) => q.difficulty === 'easy')).slice(0, easyTarget);
    const medium = shuffle(available.filter((q) => q.difficulty === 'medium')).slice(0, medTarget);
    const hard = shuffle(available.filter((q) => q.difficulty === 'hard')).slice(0, hardTarget);

    const picked = [...easy, ...medium, ...hard];

    // Pad if needed
    const remaining = available.filter((q) => !picked.includes(q) && !usedIds.has(q.id));
    const padded = [...picked, ...shuffle(remaining)].slice(0, count);

    padded.forEach((q) => usedIds.add(q.id));
    result.push(...padded);
  }

  return result;
}

export function buildModule(
  section: Section,
  moduleNum: 1 | 2,
  tier: Tier,
  isHardMod2: boolean,
  usedIds: Set<string>
): Question[] {
  const sectionPool = ALL_QUESTIONS.filter((q) => q.section === section);

  // Filter by tier-appropriate difficulty
  let diffPool: Question[];
  if (moduleNum === 1) {
    // Module 1: mixed difficulty
    diffPool = sectionPool.filter(
      (q) =>
        q.difficulty === 'easy' || q.difficulty === 'medium' || q.difficulty === 'hard'
    );
  } else if (isHardMod2) {
    // Module 2 hard: mostly medium + hard
    diffPool = sectionPool.filter(
      (q) => q.difficulty === 'medium' || q.difficulty === 'hard'
    );
  } else {
    // Module 2 easy: mostly easy + medium
    diffPool = sectionPool.filter(
      (q) => q.difficulty === 'easy' || q.difficulty === 'medium'
    );
  }

  // Tier-based sub-filtering: hard tier emphasizes harder questions
  if (tier === 'hard') {
    diffPool = diffPool.filter(
      (q) => q.difficulty === 'medium' || q.difficulty === 'hard'
    );
  } else if (tier === 'easy') {
    diffPool = diffPool.filter(
      (q) => q.difficulty === 'easy' || q.difficulty === 'medium'
    );
  }

  // Difficulty distribution for Module 1 (mixed)
  const diffDist: DifficultyDist =
    moduleNum === 1
      ? { easy: 9, medium: 12, hard: 6 }
      : isHardMod2
      ? { easy: 3, medium: 10, hard: 14 }
      : { easy: 12, medium: 12, hard: 3 };

  const domainTargets =
    section === 'reading_writing' ? RW_DOMAIN_TARGETS : MATH_DOMAIN_TARGETS;

  let questions = pickByDomain(diffPool, domainTargets, diffDist, usedIds);

  const targetCount = section === 'reading_writing' ? 27 : 22;

  // Fallback: if not enough questions, pull from broader pool
  if (questions.length < targetCount) {
    const fallback = shuffle(
      sectionPool.filter((q) => !usedIds.has(q.id))
    ).slice(0, targetCount - questions.length);
    fallback.forEach((q) => usedIds.add(q.id));
    questions = [...questions, ...fallback];
  }

  // Sort by domain then difficulty (Craft&Structure first, then by difficulty)
  questions = questions.slice(0, targetCount);

  // Order: group by domain, each group easy→hard (matches SAT spec)
  const DOMAIN_ORDER: Domain[] = section === 'reading_writing'
    ? ['craft_and_structure', 'information_and_ideas', 'expression_of_ideas', 'standard_english_conventions']
    : ['algebra', 'advanced_math', 'problem_solving_data_analysis', 'geometry_trigonometry'];
  const DIFF_ORDER: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

  questions.sort((a, b) => {
    const da = DOMAIN_ORDER.indexOf(a.domain as Domain);
    const db = DOMAIN_ORDER.indexOf(b.domain as Domain);
    if (da !== db) return da - db;
    return DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty];
  });

  return questions;
}
