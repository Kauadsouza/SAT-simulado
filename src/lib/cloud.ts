import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const timedFetch: typeof fetch = (input, init) => fetch(input, { ...init, signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000) });
export const studyAuth = url && key ? createClient(url, key, { global: { fetch: timedFetch }, auth: { detectSessionInUrl: false } }) : null;
let token: string | null = null;
let owner: string | null = null;
let cloud: SupabaseClient | null = null;
let connectionVersion = 0;

export async function connectStudy(accessToken: string) {
  const version = ++connectionVersion;
  if (!studyAuth || !url || !key) throw new Error('Sincronização ainda não configurada.');
  const { data, error } = await studyAuth.auth.getUser(accessToken);
  if (version !== connectionVersion) throw new Error('A sessão mudou. Tente novamente.');
  if (error || !data.user) throw new Error('Sessão expirada. Entre novamente pelo Hub.');
  token = accessToken;
  owner = data.user.id;
  cloud = createClient(url, key, { global: { fetch: timedFetch }, accessToken: async () => token, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  return owner;
}
export function getStudyCloud() { return { client: cloud, owner, token }; }
export function disconnectStudy() { ++connectionVersion; token = null; owner = null; cloud = null; }
