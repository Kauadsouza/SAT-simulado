/**
 * Vercel serverless function — proxies chat-completion requests to an OpenAI-compatible
 * LLM provider. The API key lives only in server env vars (LLM_BASE_URL/LLM_MODEL/LLM_API_KEY)
 * and never reaches the browser. Same handler also runs under Vite dev via a middleware
 * shim in vite.config.ts, so `npm run dev` serves /api/generate locally too.
 */
import type { IncomingMessage, ServerResponse } from 'http';

interface GenerateRequestBody {
  messages?: { role: string; content: string }[];
  temperature?: number;
}

function readJsonBody(req: IncomingMessage): Promise<GenerateRequestBody> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function callUpstream(
  baseUrl: string,
  model: string,
  apiKey: string,
  messages: GenerateRequestBody['messages'],
  temperature: number,
  attempt = 0,
): Promise<Response> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature }),
  });
  if (res.status === 429 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt)); // 1s, 2s
    return callUpstream(baseUrl, model, apiKey, messages, temperature, attempt + 1);
  }
  return res;
}

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse) {
  const baseUrl = process.env.LLM_BASE_URL;
  const model = process.env.LLM_MODEL;
  const apiKey = process.env.LLM_API_KEY;
  const configured = !!(baseUrl && model && apiKey);

  if (req.method === 'GET') {
    sendJson(res, 200, { configured });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'method_not_allowed', message: 'Use POST.' });
    return;
  }

  if (!configured) {
    sendJson(res, 503, { error: 'not_configured', message: 'Geração por IA não está configurada neste servidor.' });
    return;
  }

  let body: GenerateRequestBody;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: 'invalid_json', message: 'Corpo da requisição não é um JSON válido.' });
    return;
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    sendJson(res, 400, { error: 'invalid_request', message: '"messages" é obrigatório.' });
    return;
  }

  try {
    const upstreamRes = await callUpstream(baseUrl!, model!, apiKey!, body.messages, body.temperature ?? 0.7);
    const text = await upstreamRes.text();
    if (!upstreamRes.ok) {
      const message =
        upstreamRes.status === 429
          ? 'Limite de uso do provedor de IA atingido. Tente novamente em alguns minutos.'
          : 'Falha ao gerar conteúdo.';
      sendJson(res, upstreamRes.status, { error: 'upstream_error', message, status: upstreamRes.status });
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(text);
  } catch (e) {
    sendJson(res, 502, { error: 'network_error', message: e instanceof Error ? e.message : 'Erro de rede ao contatar o provedor de IA.' });
  }
}
