import type { DailyBlockId, IntensityMode } from '../lib/english_engine_types';

export interface DailyBlockDef {
  id: DailyBlockId;
  title: string;
  minutes: number; // target minutes at "completo" intensity
  instruction: string;
}

export const DAILY_BLOCKS: Record<DailyBlockId, DailyBlockDef> = {
  srs_review: {
    id: 'srs_review',
    title: 'Aquecimento / Revisão SRS',
    minutes: 15,
    instruction: 'Revise os cartões vencidos (palavras e chunks) — recuperação rápida da memória.',
  },
  listening: {
    id: 'listening',
    title: 'Input — Escuta',
    minutes: 25,
    instruction: 'Ouça o áudio no seu nível, com checagem de compreensão. Palavras novas vão para o SRS.',
  },
  reading: {
    id: 'reading',
    title: 'Input — Leitura',
    minutes: 20,
    instruction: 'Leitura extensiva graduada no seu nível. Vocabulário novo vai para o SRS.',
  },
  grammar_focus: {
    id: 'grammar_focus',
    title: 'Foco em padrão/gramática',
    minutes: 20,
    instruction: 'Observe os exemplos e descubra o padrão antes da regra. Depois, faça o drill rápido de pergunta-resposta.',
  },
  vocab_chunks: {
    id: 'vocab_chunks',
    title: 'Vocabulário + chunks',
    minutes: 15,
    instruction: 'Aprenda o conjunto de alta frequência do dia e use cada item em 3 frases próprias.',
  },
  output_speaking: {
    id: 'output_speaking',
    title: 'Output / Fala',
    minutes: 25,
    instruction: 'Shadowing de um clipe curto, depois grave-se respondendo ao prompt do dia e escreva 4-6 frases.',
  },
  task: {
    id: 'task',
    title: 'Tarefa comunicativa do dia',
    minutes: 15,
    instruction: 'Resolva o micro-cenário real do dia (ex.: pedir comida, descrever o fim de semana, dar opinião).',
  },
  extra_input: {
    id: 'extra_input',
    title: 'Input extra',
    minutes: 30,
    instruction: 'Bloco adicional de escuta ou leitura no modo intensivo.',
  },
  conversation: {
    id: 'conversation',
    title: 'Sessão de conversação',
    minutes: 30,
    instruction: 'Pratique conversação livre sobre o tema do dia.',
  },
};

export const INTENSITY_BLOCKS: Record<IntensityMode, DailyBlockId[]> = {
  lite: ['srs_review', 'listening', 'output_speaking'],
  completo: ['srs_review', 'listening', 'reading', 'grammar_focus', 'vocab_chunks', 'output_speaking', 'task'],
  intensivo: ['srs_review', 'listening', 'reading', 'grammar_focus', 'vocab_chunks', 'output_speaking', 'task', 'extra_input', 'conversation'],
};

export const INTENSITY_LABELS: Record<IntensityMode, { label: string; estimate: string }> = {
  lite: { label: 'Lite', estimate: '~70 min' },
  completo: { label: 'Completo', estimate: '~2h30' },
  intensivo: { label: 'Intensivo', estimate: '~3h30' },
};

export function getBlocksForIntensity(intensity: IntensityMode): DailyBlockDef[] {
  return INTENSITY_BLOCKS[intensity].map((id) => DAILY_BLOCKS[id]);
}
