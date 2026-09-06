/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'node:http';
type ApiRequest = IncomingMessage & { body?: unknown };
const MAX_BYTES = 64000;
function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
async function readBody(req: ApiRequest): Promise<unknown> {
  if (req.body !== undefined) {
    const text = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(text) > MAX_BYTES) throw new Error('large');
    return JSON.parse(text);
  }
  const chunks: Buffer[] = []; let size = 0;
  for await (const chunk of req) {
    const bytes = Buffer.from(chunk); size += bytes.length;
    if (size > MAX_BYTES) throw new Error('large');
    chunks.push(bytes);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export default async function handler(req: ApiRequest, res: ServerResponse) {
  const baseUrl = process.env.LLM_BASE_URL;
  const model = process.env.LLM_MODEL;
  const apiKey = process.env.LLM_API_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const publicKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const configured = Boolean(baseUrl && model && apiKey && supabaseUrl && publicKey);
  if (req.method === 'GET') return send(res, 200, { configured });
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return send(res, 405, { message: 'Use POST.' }); }
  const token = req.headers.authorization;
  if (!supabaseUrl || !publicKey || !token?.startsWith('Bearer ') || token.length > 8192) return send(res, 401, { message: 'Entre pelo Hub para usar a IA.' });
  try {
    const auth = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: publicKey, Authorization: token }, signal: AbortSignal.timeout(10000) });
    if (!auth.ok) return send(res, 401, { message: 'Sessão inválida ou expirada. Entre novamente.' });
    if (!configured) return send(res, 503, { message: 'A IA está indisponível. Continue com os exercícios e leituras da biblioteca.' });
    const raw = await readBody(req);
    if (!raw || typeof raw !== 'object') return send(res, 400, { message: 'Pedido inválido.' });
    const body = raw as { messages?: unknown; temperature?: unknown };
    if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 16 || body.messages.some(message => !message || typeof message !== 'object' || !['system','user','assistant'].includes(message.role) || typeof message.content !== 'string' || message.content.length > 24000)) return send(res, 400, { message: 'Mensagens inválidas ou muito longas.' });
    const temperature = body.temperature ?? 0.7;
    if (typeof temperature !== 'number' || !Number.isFinite(temperature) || temperature < 0 || temperature > 2) return send(res, 400, { message: 'Temperatura inválida.' });
    const quota = await fetch(`${supabaseUrl}/rest/v1/rpc/claim_study_generation`, { method: 'POST', headers: { apikey: publicKey, Authorization: token, 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(10000) });
    if (!quota.ok) return send(res, 503, { message: 'A geração está temporariamente indisponível. Use a biblioteca de exercícios.' });
    if (await quota.json() !== true) { res.setHeader('Retry-After', '3600'); return send(res, 429, { message: 'Limite de 20 gerações por hora atingido. Continue pela biblioteca e tente mais tarde.' }); }
    const upstream = await fetch(`${baseUrl!.replace(/\/$/, '')}/chat/completions`, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, messages: body.messages, temperature, max_tokens: 3000 }), signal: AbortSignal.timeout(45000) });
    if (!upstream.ok) return send(res, upstream.status === 429 ? 429 : 502, { message: 'O provedor não concluiu a geração. Tente mais tarde.' });
    const result = await upstream.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const content = result?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return send(res, 502, { message: 'O provedor retornou uma resposta inválida.' });
    return send(res, 200, { choices: [{ message: { content } }] });
  } catch (error) {
    if (error instanceof SyntaxError) return send(res, 400, { message: 'JSON inválido.' });
    if (error instanceof Error && error.message === 'large') return send(res, 413, { message: 'Pedido muito grande.' });
    return send(res, 503, { message: 'Falha de conexão. Seu progresso está preservado.' });
  }
}
