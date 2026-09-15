import { db } from '../db';
import { loadEngineProgress } from './english_engine_storage';

export type SpanishLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type SpanishVariant = 'espana' | 'latam';

export const SPANISH_VARIANTS: Record<SpanishVariant, {
  label: string;
  shortLabel: string;
  locale: 'es-ES' | 'es-419';
  context: string;
  description: string;
}> = {
  espana: {
    label: 'Espanhol da Espanha',
    shortLabel: 'Espanha',
    locale: 'es-ES',
    context: 'Estudo e vida na Espanha',
    description: 'Pronúncia peninsular, uso de vosotros e vocabulário do dia a dia na Espanha.',
  },
  latam: {
    label: 'Espanhol da América Latina',
    shortLabel: 'América Latina',
    locale: 'es-419',
    context: 'Convivência e mídia latino-americana',
    description: 'Pronúncia latino-americana, ustedes no lugar de vosotros e vocabulário mais próximo do português.',
  },
};

export interface SpanishExamAttempt {
  date: string;
  correct: number;
  total: number;
}

export interface SpanishHubState {
  version: 1;
  settings: { level: SpanishLevel; variant: SpanishVariant; minutes: number; days: number; reviewDate: string };
  days: Record<string, { done: string[]; minutes: number }>;
  journal: Record<string, string>;
  checks: Record<string, boolean[]>;
  attempts: SpanishExamAttempt[];
}

export function defaultSpanishHub(): SpanishHubState {
  return {
    version: 1,
    settings: { level: 'A1', variant: 'latam', minutes: 30, days: 5, reviewDate: '2027-04-30' },
    days: {},
    journal: {},
    checks: {},
    attempts: [],
  };
}

export function getSpanishHub(value?: SpanishHubState): SpanishHubState {
  const defaults = defaultSpanishHub();
  const settings = { ...defaults.settings, ...value?.settings };
  if (!['espana', 'latam'].includes(settings.variant)) settings.variant = defaults.settings.variant;
  return { ...defaults, ...value, version: 1, settings, attempts: value?.attempts ?? [] };
}

// Stored next to the English record so the existing study sync carries it without a new table.
export async function updateSpanishHub(userId: string, edit: (state: SpanishHubState) => void): Promise<SpanishHubState> {
  return db.transaction('rw', db.englishEngine, async () => {
    const progress = await loadEngineProgress(userId);
    const hub = getSpanishHub(progress.spanishHub);
    edit(hub);
    if (!['A1', 'A2', 'B1', 'B2'].includes(hub.settings.level) || !['espana', 'latam'].includes(hub.settings.variant) || ![15, 30, 45, 60].includes(hub.settings.minutes) || !Number.isInteger(hub.settings.days) || hub.settings.days < 3 || hub.settings.days > 7 || !/^\d{4}-\d{2}-\d{2}$/.test(hub.settings.reviewDate) || !Number.isFinite(Date.parse(hub.settings.reviewDate))) throw new Error('Confira as configurações do plano.');
    hub.attempts = hub.attempts.slice(-50);
    if (JSON.stringify(hub).length > 500_000) throw new Error('Seu caderno está cheio. Exporte um backup antes de continuar.');
    await db.englishEngine.put({ ...progress, spanishHub: hub, updatedAt: new Date().toISOString() });
    return hub;
  });
}

export function conversationPromptEs(level: SpanishLevel, topic: string, minutes: number, variant: SpanishVariant = 'latam'): string {
  const target = variant === 'espana'
    ? 'espanhol da Espanha, com vocabulário peninsular e uso de vosotros quando for natural'
    : 'espanhol da América Latina, com vocabulário latino-americano e ustedes no lugar de vosotros';
  return `Você é meu parceiro paciente de conversação em espanhol. Minha língua principal é português brasileiro e meu nível de prática escolhido é ${level} (não é uma certificação). Quero uma sessão de aproximadamente ${minutes} minutos sobre: ${topic}.

Minha variedade de estudo nesta sessão é ${target}. Use essa variedade de forma consistente nas suas falas, exemplos e escolhas de vocabulário. Aceite respostas corretas na outra variedade sem tratá-las como erro; quando houver uma diferença útil, mostre a forma-alvo brevemente (por exemplo, coche/carro ou ordenador/computadora) e continue a conversa.

Português e espanhol são parecidos, e é exatamente aí que eu erro. Preste atenção especial em portunhol e falsos amigos (embarazada, exquisito, salsa, oficina, rato, largo, pelado). Quando eu usar uma palavra portuguesa com cara de espanhol, mostre a forma correta em uma linha e siga adiante.

Faça APENAS UMA pergunta por vez e espere minha resposta. Use espanhol compatível com meu nível. Se eu travar, ofereça duas opções, uma frase inicial ou uma explicação curta em português; depois retome o espanhol. Não responda por mim.

Faça um role-play com uma situação real. Depois da minha resposta, escolha no máximo um erro importante, mostre uma reformulação natural e me peça para tentar de novo. Não corrija cada palavra.

Quando eu disser “resumen”, encerre com: 3 coisas que consegui comunicar; até 3 correções (minha frase → versão natural + motivo em português); 3 expressões úteis com tradução e exemplo; uma atividade curta para amanhã. Não atribua nota de prova nem nível oficial. Comece agora.`;
}
