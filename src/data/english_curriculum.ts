import type { CurriculumPhase, WeekInfo } from '../lib/curriculum_types';

export const TOTAL_WEEKS = 26;

export const CHECKPOINT_WEEKS = [5, 9, 12, 16, 20, 24, 26];

// Honest expectation shown to the user — A1→B2 ≈ 400-500 guided hours (Cambridge/CEFR estimates).
export const ESTIMATED_TOTAL_HOURS = { min: 400, max: 500 };
export const REQUIRED_DAILY_HOURS = { min: 2.5, max: 3 };

export const CURRICULUM_PHASES: CurriculumPhase[] = [
  {
    id: 1,
    label: 'Fundação',
    weekStart: 1,
    weekEnd: 5,
    cefrFrom: 'A1',
    cefrTo: 'A2',
    focus: 'Sobrevivência, fonética, automatizar present simple e perguntas',
    coreGrammar: ['to be', 'present simple/continuous', 'articles', 'plurals', 'possessives', 'there is/are', 'can', 'prepositions', 'WH-questions'],
    vocabTarget: 900,
    canDo: ['Apresentar-se', 'Descrever a rotina diária', 'Fazer compras simples', 'Pedir comida', 'Fazer descrições simples'],
  },
  {
    id: 2,
    label: 'Construção',
    weekStart: 6,
    weekEnd: 12,
    cefrFrom: 'A2',
    cefrTo: 'B1',
    focus: 'Passado/futuro, conectar ideias, conversa do dia a dia',
    coreGrammar: ['past simple/continuous', 'will/going to', 'present perfect (intro)', 'comparatives/superlatives', 'quantifiers', 'modais (should/must/have to)', 'conjunctions', 'gerund/infinitive (intro)'],
    vocabTarget: 1800,
    canDo: ['Narrar experiências passadas', 'Falar sobre planos futuros', 'Dar opiniões simples', 'Conversar sobre viagens', 'Entender textos curtos conectados'],
  },
  {
    id: 3,
    label: 'Independência',
    weekStart: 13,
    weekEnd: 20,
    cefrFrom: 'B1',
    cefrTo: 'B2',
    focus: 'Estruturas complexas, argumentação, áudio/leitura mais longos',
    coreGrammar: ['present perfect (pleno) vs past', 'perfect continuous', 'conditionals 0/1/2 (intro 3)', 'passive', 'reported speech', 'relative clauses', 'used to/would'],
    vocabTarget: 3000,
    canDo: ['Argumentar e justificar opiniões', 'Entender textos complexos', 'Interagir com naturalidade'],
  },
  {
    id: 4,
    label: 'Consolidação B2',
    weekStart: 21,
    weekEnd: 26,
    cefrFrom: 'B2',
    cefrTo: 'B2',
    focus: 'Fluência, abstração, velocidade, produção estendida',
    coreGrammar: ['refino de todos os tempos verbais', 'conditionals mistos', 'inversões básicas', 'cleft sentences (intro)', 'hedging/modalidade', 'coesão avançada'],
    vocabTarget: 3500,
    canDo: ['Discutir temas abstratos', 'Produzir fala/texto claros e detalhados', 'Falar com baixa hesitação'],
  },
];

export function getPhaseForWeek(weekNumber: number): CurriculumPhase {
  const clamped = Math.min(Math.max(weekNumber, 1), TOTAL_WEEKS);
  return (
    CURRICULUM_PHASES.find((p) => clamped >= p.weekStart && clamped <= p.weekEnd) ??
    CURRICULUM_PHASES[CURRICULUM_PHASES.length - 1]
  );
}

export function getWeekInfo(weekNumber: number): WeekInfo {
  const clamped = Math.min(Math.max(weekNumber, 1), TOTAL_WEEKS);
  return {
    weekNumber: clamped,
    phase: getPhaseForWeek(clamped),
    isCheckpoint: CHECKPOINT_WEEKS.includes(clamped),
  };
}

/** Calendar-driven rollover: the week advances with real days elapsed, capped at TOTAL_WEEKS. A missed day does not reset progress. */
export function getCurrentWeekNumber(startDateISO: string, now = new Date()): number {
  const start = new Date(startDateISO);
  const daysElapsed = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const week = Math.floor(daysElapsed / 7) + 1;
  return Math.min(Math.max(week, 1), TOTAL_WEEKS);
}
