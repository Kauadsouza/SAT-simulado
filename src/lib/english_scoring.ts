import type { CEFRLevel, Question, PlacementAnswer, Skill } from './english_types';

export const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Threshold to "pass" a level in the placement test
export const PLACEMENT_THRESHOLD = 0.65;
// Threshold to complete a lesson
export const LESSON_PASS_THRESHOLD = 0.70;

export const CEFR_LABELS: Record<CEFRLevel, string> = {
  A1: 'A1 — Iniciante',
  A2: 'A2 — Elementar',
  B1: 'B1 — Intermediário',
  B2: 'B2 — Intermediário Superior',
  C1: 'C1 — Avançado',
  C2: 'C2 — Domínio',
};

export const CEFR_DESCRIPTIONS: Record<CEFRLevel, string> = {
  A1: 'Você consegue entender e usar expressões cotidianas básicas e frases muito simples para se apresentar e interagir de forma elementar.',
  A2: 'Você consegue se comunicar em tarefas simples e rotineiras, descrever sua rotina e falar sobre temas do dia a dia.',
  B1: 'Você consegue lidar com a maioria das situações ao viajar, produzir texto simples sobre temas familiares e descrever experiências.',
  B2: 'Você consegue entender textos complexos, interagir com fluência com falantes nativos e expressar opiniões com clareza.',
  C1: 'Você usa o inglês com flexibilidade e eficácia, compreende textos longos e se expressa de forma espontânea e fluente.',
  C2: 'Você domina praticamente toda a língua inglesa, com precisão, fluência e nuances quase idênticas às de um falante nativo.',
};

export const XP_PER_LESSON = 50;
export const XP_STREAK_BONUS = 10;

/**
 * Ceiling-with-foundation algorithm:
 * Walk CEFR levels from A1 upward. The user's level is the highest *consecutive*
 * level where they met the threshold. Stop at the first gap.
 *
 * TODO adaptive: replace with a binary-search adaptive item selection for v2.
 */
export function calculatePlacementLevel(
  questions: Question[],
  answers: PlacementAnswer[],
): {
  level: CEFRLevel;
  perLevel: Record<CEFRLevel, { correct: number; total: number; pct: number }>;
  perSkill: Record<Skill, number>;
} {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  // Per-level tallies
  const perLevel = Object.fromEntries(
    CEFR_ORDER.map((l) => [l, { correct: 0, total: 0, pct: 0 }]),
  ) as Record<CEFRLevel, { correct: number; total: number; pct: number }>;

  // Per-skill tallies
  const skillMap: Record<Skill, { c: number; t: number }> = {
    grammar: { c: 0, t: 0 },
    vocabulary: { c: 0, t: 0 },
    reading: { c: 0, t: 0 },
  };

  for (const q of questions) {
    const ans = answerMap.get(q.id);
    if (!ans) continue;
    perLevel[q.level].total++;
    skillMap[q.skill].t++;
    if (ans.correct) {
      perLevel[q.level].correct++;
      skillMap[q.skill].c++;
    }
  }

  for (const lvl of CEFR_ORDER) {
    const d = perLevel[lvl];
    d.pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
  }

  // Ceiling algorithm
  let level: CEFRLevel = 'A1';
  for (const lvl of CEFR_ORDER) {
    const { correct, total } = perLevel[lvl];
    if (total === 0) continue; // no questions → skip (don't penalise)
    if (correct / total >= PLACEMENT_THRESHOLD) {
      level = lvl;
    } else {
      break; // first gap → stop
    }
  }

  const perSkill: Record<Skill, number> = {
    grammar: skillMap.grammar.t > 0 ? Math.round((skillMap.grammar.c / skillMap.grammar.t) * 100) : 0,
    vocabulary: skillMap.vocabulary.t > 0 ? Math.round((skillMap.vocabulary.c / skillMap.vocabulary.t) * 100) : 0,
    reading: skillMap.reading.t > 0 ? Math.round((skillMap.reading.c / skillMap.reading.t) * 100) : 0,
  };

  return { level, perLevel, perSkill };
}

/** Returns the index of a level in CEFR_ORDER */
export function cefrIndex(level: CEFRLevel): number {
  return CEFR_ORDER.indexOf(level);
}

/** Returns true if targetLevel is below the user's diagnosed level (dispensed) */
export function isDispensed(userLevel: CEFRLevel, targetLevel: CEFRLevel): boolean {
  return cefrIndex(targetLevel) < cefrIndex(userLevel);
}

/** Returns true if targetLevel is above the next unlockable level */
export function isLocked(userLevel: CEFRLevel, targetLevel: CEFRLevel, completedLevels: Set<CEFRLevel>): boolean {
  const idx = cefrIndex(targetLevel);
  if (idx === 0) return false;
  const prev = CEFR_ORDER[idx - 1];
  // Locked if previous level is not the user's current level and not completed
  return !isDispensed(userLevel, targetLevel) && targetLevel !== userLevel && !completedLevels.has(prev);
}

/** Progress (0-100) from diagnosed level to C2 based on lessons completed */
export function calcOverallProgress(
  userLevel: CEFRLevel,
  lessonStatus: Record<string, { completed: boolean }>,
  totalLessonsPerLevel: Record<CEFRLevel, number>,
): number {
  const startIdx = cefrIndex(userLevel);
  const levelsToComplete = CEFR_ORDER.slice(startIdx);
  let done = 0;
  let total = 0;
  for (const lvl of levelsToComplete) {
    const count = totalLessonsPerLevel[lvl] ?? 0;
    total += count;
    const completedHere = Object.entries(lessonStatus).filter(
      ([id, s]) => s.completed && id.startsWith(lvl.toLowerCase()),
    ).length;
    done += Math.min(completedHere, count);
  }
  return total > 0 ? Math.round((done / total) * 100) : 0;
}
