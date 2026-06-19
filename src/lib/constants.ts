import type { ModuleInfo, ModuleId } from './types';

export const MODULE_INFO: Record<ModuleId, ModuleInfo> = {
  rw1: {
    id: 'rw1',
    section: 'reading_writing',
    module: 1,
    label: 'Reading & Writing — Module 1',
    questionCount: 27,
    durationSec: 32 * 60,
  },
  rw2: {
    id: 'rw2',
    section: 'reading_writing',
    module: 2,
    label: 'Reading & Writing — Module 2',
    questionCount: 27,
    durationSec: 32 * 60,
  },
  math1: {
    id: 'math1',
    section: 'math',
    module: 1,
    label: 'Math — Module 1',
    questionCount: 22,
    durationSec: 35 * 60,
  },
  math2: {
    id: 'math2',
    section: 'math',
    module: 2,
    label: 'Math — Module 2',
    questionCount: 22,
    durationSec: 35 * 60,
  },
};

export const MODULE_ORDER: ModuleId[] = ['rw1', 'rw2', 'math1', 'math2'];

export const BREAK_DURATION_SEC = 10 * 60;

export const DOMAIN_LABELS: Record<string, string> = {
  craft_and_structure: 'Craft & Structure',
  information_and_ideas: 'Information & Ideas',
  standard_english_conventions: 'Standard English Conventions',
  expression_of_ideas: 'Expression of Ideas',
  algebra: 'Algebra',
  advanced_math: 'Advanced Math',
  problem_solving_data_analysis: 'Problem-Solving & Data Analysis',
  geometry_trigonometry: 'Geometry & Trigonometry',
};

// Per-skill labels (PT-BR) for drill filters & analytics. Keys match q.skill.
export const SKILL_LABELS: Record<string, string> = {
  // Reading & Writing
  words_in_context: 'Palavras em Contexto',
  text_structure_and_purpose: 'Estrutura e Propósito do Texto',
  cross_text_connections: 'Conexões entre Textos',
  central_ideas_and_details: 'Ideias Centrais e Detalhes',
  command_of_evidence_textual: 'Evidência Textual',
  command_of_evidence_quantitative: 'Evidência Quantitativa',
  inferences: 'Inferências',
  sentence_boundaries: 'Limites de Frase (pontuação)',
  form_structure_and_sense: 'Forma, Estrutura e Sentido',
  rhetorical_synthesis: 'Síntese Retórica',
  transitions: 'Transições',
  // Math
  linear_equations: 'Equações Lineares',
  linear_inequalities: 'Inequações Lineares',
  systems_linear: 'Sistemas Lineares',
  linear_functions: 'Funções Lineares',
  quadratic_functions: 'Funções Quadráticas',
  exponential_functions: 'Funções Exponenciais',
  polynomial_functions: 'Funções Polinomiais',
  ratios_rates: 'Razões e Proporções',
  percentages: 'Porcentagens',
  data_interpretation: 'Interpretação de Dados',
  probability: 'Probabilidade',
  statistics: 'Estatística',
  area_volume: 'Área e Volume',
  triangles: 'Triângulos',
  circles: 'Círculos',
  trigonometry: 'Trigonometria',
};

export function skillLabel(skill: string): string {
  return SKILL_LABELS[skill] ?? skill.replace(/_/g, ' ');
}

export const TIER_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const TIER_DESCRIPTIONS: Record<string, string> = {
  easy: 'Simpler passages, accessible vocabulary, basic math. With Portuguese hover-translation.',
  medium: 'Real SAT difficulty — realistic exam experience. With Portuguese hover-translation.',
  hard: 'Above SAT level — denser passages, subtler distractors, harder math. English only (no translation).',
};
