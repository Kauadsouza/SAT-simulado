import { db } from '../db';
import { loadEngineProgress } from './english_engine_storage';

export type LearningLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type CourseStatus = 'not_started' | 'in_progress' | 'completed';
export interface LearningHubState {
  version: 1;
  settings: { level: LearningLevel; minutes: number; days: number; reviewDate: string };
  courses: Record<string, { status: CourseStatus; note: string }>;
  days: Record<string, { done: string[]; minutes: number }>;
  journal: Record<string, string>;
  checks: Record<string, boolean[]>;
}

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function defaultLearningHub(): LearningHubState {
  return { version: 1, settings: { level: 'A1', minutes: 30, days: 5, reviewDate: '2027-04-30' }, courses: {}, days: {}, journal: {}, checks: {} };
}
export function getLearningHub(value?: LearningHubState): LearningHubState {
  const defaults = defaultLearningHub();
  return { ...defaults, ...value, settings: { ...defaults.settings, ...value?.settings } };
}
// Keep the new workspace inside the existing, synchronised English record.
// Transactions read the latest record, preserving SAT, lessons and other tabs.
export async function updateLearningHub(userId: string, edit: (state: LearningHubState) => void): Promise<LearningHubState> {
  return db.transaction('rw', db.englishEngine, async () => {
    const progress = await loadEngineProgress(userId);
    const hub = getLearningHub(progress.learningHub);
    edit(hub);
    if (!['A1', 'A2', 'B1', 'B2'].includes(hub.settings.level) || ![15, 30, 45, 60].includes(hub.settings.minutes) || !Number.isInteger(hub.settings.days) || hub.settings.days < 3 || hub.settings.days > 7 || !/^\d{4}-\d{2}-\d{2}$/.test(hub.settings.reviewDate) || !Number.isFinite(Date.parse(hub.settings.reviewDate))) throw new Error('Confira as configurações do plano.');
    if (JSON.stringify(hub).length > 500_000) throw new Error('Seu caderno está cheio. Exporte um backup antes de continuar.');
    await db.englishEngine.put({ ...progress, learningHub: hub, updatedAt: new Date().toISOString() });
    return hub;
  });
}
export function studyBudget(minutes: number): number[] {
  // Listening, active practice, speaking, retrieval: always exactly the chosen budget.
  const listen = Math.round(minutes / 3);
  const practice = Math.round(minutes / 3);
  const speaking = Math.round(minutes / 6);
  return [listen, practice, speaking, minutes - listen - practice - speaking];
}
export function weeklyActivity(state: LearningHubState, now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now); date.setDate(date.getDate() - (6 - i));
    const key = localDate(date);
    return { date: key, label: date.toLocaleDateString('pt-BR', { weekday: 'short' }), minutes: state.days[key]?.minutes ?? 0 };
  });
}
export function conversationPrompt(level: LearningLevel, topic: string, minutes: number): string {
  return `Você é meu parceiro paciente de conversação em inglês. Minha língua principal é português brasileiro e meu nível de prática escolhido é ${level} (não é uma certificação). Quero uma sessão de aproximadamente ${minutes} minutos sobre: ${topic}.

Meu objetivo é ganhar autonomia aos poucos, sem prometer fluência numa data fixa. Não dependa de eu conviver com falantes de inglês. Comece com uma pergunta simples para ajustar a dificuldade.

Se estivermos em voz, fale devagar e com clareza; se estivermos em texto, use turnos curtos. Faça APENAS UMA pergunta por vez e espere minha resposta. Use inglês compatível com meu nível. Se eu travar, ofereça duas opções, uma frase inicial ou uma explicação curta em português; depois retome o inglês. Não responda por mim.

Faça um role-play com uma situação real. Depois da minha resposta, escolha no máximo um erro importante, mostre uma reformulação natural e me peça para tentar de novo. Não corrija cada palavra. Se você não entender o áudio, peça repetição; não invente problemas de pronúncia a partir da transcrição. Aumente a dificuldade apenas quando eu conseguir acompanhar.

Quando eu disser “resumo”, encerre com: 3 coisas que consegui comunicar; até 3 correções (minha frase → versão natural + motivo em português); 3 expressões úteis com tradução e exemplo; uma atividade curta para amanhã. Não atribua nota de prova nem nível CEFR oficial. Comece agora.`;
}
