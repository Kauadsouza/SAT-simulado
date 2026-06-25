import type { CEFRLevel } from './english_types';
import { chatComplete, extractJson } from './llm_client';

export interface ReadingQuestion {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReadingVocabItem {
  word: string;
  translation: string;
  example: string;
}

export interface ReadingContent {
  passage: string;
  questions: ReadingQuestion[];
  vocab: ReadingVocabItem[];
}

const WORD_RANGE: Record<CEFRLevel, string> = {
  A1: '40-60',
  A2: '60-100',
  B1: '100-150',
  B2: '150-200',
  C1: '180-230',
  C2: '200-260',
};

const SYSTEM_PROMPT =
  'Você é um gerador de material didático de inglês como segunda língua, especializado em textos graduados calibrados por nível CEFR (i+1: levemente acima do nível do aluno, mas compreensível). Responda SEMPRE em JSON puro, sem markdown, sem comentários antes ou depois.';

function buildPrompt(cefr: CEFRLevel, topicHint?: string): string {
  return `Gere uma passagem de leitura graduada em inglês para um estudante de nível CEFR ${cefr}.

Requisitos:
- Comprimento: ${WORD_RANGE[cefr]} palavras.
- Vocabulário e estruturas gramaticais apropriados para o nível ${cefr} — nada significativamente além disso.
- Tema: ${topicHint ?? 'cotidiano, interessante e culturalmente neutro'}.
- Exatamente 3 perguntas de compreensão, múltipla escolha, 4 alternativas cada, com exatamente uma correta (correctIndex de 0 a 3).
- Uma lista de 5 a 7 palavras ou expressões retiradas do texto (vocabulário-chave do nível), cada uma com tradução em português do Brasil e uma frase de exemplo em inglês.

Responda APENAS com um JSON válido, exatamente neste formato:
{
  "passage": "string em inglês",
  "questions": [
    { "prompt": "string em inglês", "choices": ["string", "string", "string", "string"], "correctIndex": 0, "explanation": "string em português explicando por que a resposta está correta" }
  ],
  "vocab": [
    { "word": "string em inglês", "translation": "string em português", "example": "frase em inglês usando a palavra" }
  ]
}`;
}

function validate(content: ReadingContent): void {
  if (!content.passage || typeof content.passage !== 'string') throw new Error('passage ausente ou inválido');
  if (!Array.isArray(content.questions) || content.questions.length === 0) throw new Error('questions ausente ou vazio');
  for (const q of content.questions) {
    if (!Array.isArray(q.choices) || q.choices.length !== 4) throw new Error('questão sem 4 alternativas');
    if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) throw new Error('correctIndex inválido');
  }
  if (!Array.isArray(content.vocab) || content.vocab.length === 0) throw new Error('vocab ausente ou vazio');
}

export async function generateReadingContent(cefr: CEFRLevel, topicHint?: string): Promise<ReadingContent> {
  const raw = await chatComplete(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildPrompt(cefr, topicHint) },
    ],
    { temperature: 0.8 },
  );
  const content = extractJson<ReadingContent>(raw);
  validate(content);
  return content;
}
