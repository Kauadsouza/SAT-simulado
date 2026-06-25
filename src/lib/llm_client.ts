/**
 * Browser-side LLM client. Never talks to the LLM provider directly — always goes through
 * /api/generate (a Vercel serverless function in production, a Vite dev middleware locally)
 * so the API key never reaches the public bundle.
 */
import type { LlmMessage } from './llm_types';

export class LlmError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

export async function chatComplete(messages: LlmMessage[], opts: { temperature?: number } = {}): Promise<string> {
  let res: Response;
  try {
    res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, temperature: opts.temperature ?? 0.7 }),
    });
  } catch (e) {
    throw new LlmError('Não foi possível conectar ao servidor.', 'network_error');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new LlmError(data?.message || `Erro ${res.status} ao gerar conteúdo.`, data?.error);
  }
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new LlmError('Resposta da IA veio sem conteúdo de texto.');
  }
  return content;
}

/** Extracts the first valid JSON object from a model response, tolerating markdown fences or stray prose around it. */
export function extractJson<T>(raw: string): T {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    /* fall through to extraction */
  }
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      /* fall through to error */
    }
  }
  throw new LlmError('Não foi possível interpretar a resposta da IA como JSON.');
}

/** Cheap check — asks the proxy whether a backend is configured, without calling the upstream provider. */
export async function checkAiAvailable(): Promise<boolean> {
  try {
    const res = await fetch('/api/generate');
    if (!res.ok) return false;
    const data = await res.json();
    return !!data?.configured;
  } catch {
    return false;
  }
}
