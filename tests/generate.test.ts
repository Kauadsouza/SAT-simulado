import { Readable } from 'node:stream';
import { beforeEach, expect, test, vi } from 'vitest';
import handler from '../api/generate';
const fetchMock=vi.fn();
beforeEach(()=>{vi.stubGlobal('fetch',fetchMock);fetchMock.mockReset();for(const key of ['LLM_BASE_URL','LLM_MODEL','LLM_API_KEY','VITE_SUPABASE_URL','VITE_SUPABASE_PUBLISHABLE_KEY'])vi.stubEnv(key,'https://test.invalid');});
async function call(body: unknown, authenticated=true) {
  const req=Object.assign(Readable.from([]),{method:'POST',headers:authenticated?{authorization:'Bearer test-session'}:{},body});
  let response:unknown;
  const res={statusCode:0,setHeader:vi.fn(),end:(text:string)=>{response=JSON.parse(text)}};
  await handler(req as never,res as never);return {status:res.statusCode,body:response};
}
test('anonymous calls fail before reaching a provider',async()=>{expect((await call({},false)).status).toBe(401);expect(fetchMock).not.toHaveBeenCalled();});
test('invalid sessions fail before generation',async()=>{fetchMock.mockResolvedValueOnce(new Response('{}',{status:401}));expect((await call({messages:[]})).status).toBe(401);expect(fetchMock).toHaveBeenCalledTimes(1);});
test('preparsed oversized Vercel bodies are rejected',async()=>{fetchMock.mockResolvedValueOnce(new Response('{}'));expect((await call({messages:[{role:'user',content:'x'.repeat(65000)}]})).status).toBe(413);expect(fetchMock).toHaveBeenCalledTimes(1);});
test('quota blocks paid upstream calls',async()=>{fetchMock.mockResolvedValueOnce(new Response('{}')).mockResolvedValueOnce(new Response('false'));expect((await call({messages:[{role:'user',content:'Reading practice'}]})).status).toBe(429);expect(fetchMock).toHaveBeenCalledTimes(2);});
