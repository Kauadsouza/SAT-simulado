import { db } from '../db';
import { getStudyCloud } from './cloud';

const collections = ['sessions', 'englishProgress', 'englishEngine', 'srsCards', 'generatedContent'] as const;
type Snapshot = Record<string, unknown[]>;
type SyncMarker = { revision: number; hash: string };
function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a],[b]) => a.localeCompare(b))) : item);
}
export async function studySnapshot(profile: string): Promise<Snapshot> {
  const entries = await Promise.all(collections.map(async name => [name, await db.table(name).where('userId').equals(profile).toArray()]));
  return Object.fromEntries(entries);
}
async function hash(snapshot: Snapshot) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical(snapshot)));
  return Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, '0')).join('');
}
function isEmpty(snapshot: Snapshot) { return Object.values(snapshot).every(rows => rows.length === 0); }

/** Compare-and-swap prevents another device's newer progress being silently replaced. */
export async function syncStudy(profile: string) {
  const { client, owner } = getStudyCloud();
  if (!client || !owner) throw new Error('Somente neste dispositivo. Entre pelo Hub para sincronizar.');
  const bindingKey = `artx-study-owner:${profile}`;
  const boundOwner = localStorage.getItem(bindingKey);
  if (boundOwner && boundOwner !== owner) throw new Error('Este perfil local está vinculado a outra conta. Escolha um perfil diferente para esta conta.');
  localStorage.setItem(bindingKey, owner);
  if (!navigator.onLine) throw new Error('Sem conexão. As alterações continuam salvas neste dispositivo.');
  const markerKey = `artx-study-sync:${owner}:${profile}`;
  let marker: SyncMarker | null = null;
  try { marker = JSON.parse(localStorage.getItem(markerKey) ?? 'null'); } catch { /* legacy cache */ }
  const local = await studySnapshot(profile);
  const localHash = await hash(local);
  const { data: remote, error } = await client.from('hub_app_state').select('payload,revision').eq('app', 'study').eq('profile', profile).maybeSingle();
  if (error) throw new Error('Não foi possível sincronizar. Seu progresso local está preservado.');
  const dirty = marker ? marker.hash !== localHash : !isEmpty(local);
  if (remote && (!marker || remote.revision !== marker.revision)) {
    const remoteHash = await hash(remote.payload);
    if (dirty && remoteHash !== localHash) throw new Error('Há progresso diferente em outro dispositivo. As duas cópias estão preservadas. Exporte a cópia local antes de resolver o conflito.');
    if (remoteHash !== localHash) {
      if (await hash(await studySnapshot(profile)) !== localHash) throw new Error('Há alterações locais em andamento. Tente sincronizar novamente.');
      for (const name of collections) {
        if (!Array.isArray(remote.payload[name]) || remote.payload[name].some((row: {userId?: string}) => row?.userId !== profile)) throw new Error('Backup incompatível. A cópia local foi preservada.');
      }
      await db.transaction('rw', collections.map(name => db.table(name)), async () => {
        for (const name of collections) {
          await db.table(name).where('userId').equals(profile).delete();
          await db.table(name).bulkPut(remote.payload[name]);
        }
      });
    }
    localStorage.setItem(markerKey, JSON.stringify({ revision: remote.revision, hash: remoteHash }));
    return;
  }
  if (!dirty && remote) return;
  const { data: revision, error: saveError } = await client.rpc('save_hub_app_state', { p_app: 'study', p_profile: profile, p_payload: local, p_revision: remote?.revision ?? 0 });
  if (saveError) throw new Error(saveError.code === '40001' ? 'Outro dispositivo salvou uma versão mais recente. As cópias estão preservadas; tente sincronizar novamente.' : 'Falha ao enviar. Seu progresso continua neste dispositivo.');
  localStorage.setItem(markerKey, JSON.stringify({ revision, hash: localHash }));
}

export async function exportStudy(profile: string) {
  const data = { format: 'artx-study-v1', profile, exportedAt: new Date().toISOString(), data: await studySnapshot(profile) };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = `artx-estudos-${new Date().toISOString().slice(0,10)}.json`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Leitura de um arquivo gerado por exportStudy.
 *
 * Existia exportação sem importação: o botão "Exportar backup" produzia um
 * arquivo que nada no sistema sabia ler. Um backup que ninguém consegue
 * restaurar não é backup, é esperança.
 *
 * A restauração reescreve o `userId` de cada linha para o perfil de destino.
 * Sem isso, restaurar num perfil diferente daquele que exportou gravaria
 * linhas órfãs, invisíveis para quem está usando o app.
 */
export type StudyBackup = { profile: string; exportedAt: string; data: Snapshot };
export type RestorePlan = { backup: StudyBackup; counts: Record<string, number>; total: number };

export function parseStudyBackup(text: string): StudyBackup {
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new Error('Arquivo inválido: não é um JSON legível.'); }
  if (!parsed || typeof parsed !== 'object') throw new Error('Arquivo inválido: conteúdo inesperado.');
  const candidate = parsed as Partial<StudyBackup> & { format?: string };
  if (candidate.format !== 'artx-study-v1') throw new Error('Este arquivo não é um backup de estudos do ARTX.');
  if (!candidate.data || typeof candidate.data !== 'object') throw new Error('Arquivo inválido: sem dados de estudo.');

  const data: Snapshot = {};
  for (const name of collections) {
    const rows = (candidate.data as Snapshot)[name];
    if (rows === undefined) { data[name] = []; continue; }
    if (!Array.isArray(rows)) throw new Error(`Arquivo inválido: "${name}" deveria ser uma lista.`);
    if (rows.some(row => !row || typeof row !== 'object')) throw new Error(`Arquivo inválido: "${name}" tem registros corrompidos.`);
    data[name] = rows;
  }

  return {
    profile: typeof candidate.profile === 'string' ? candidate.profile : '',
    exportedAt: typeof candidate.exportedAt === 'string' ? candidate.exportedAt : '',
    data,
  };
}

/** Lê o arquivo e conta o que ele traz, para confirmar antes de gravar qualquer coisa. */
export function planRestore(text: string): RestorePlan {
  const backup = parseStudyBackup(text);
  const counts = Object.fromEntries(collections.map(name => [name, backup.data[name]?.length ?? 0]));
  return { backup, counts, total: Object.values(counts).reduce((sum, count) => sum + count, 0) };
}

/**
 * Grava o backup no perfil indicado, substituindo o que existe hoje nele.
 *
 * A transação cobre todas as coleções de uma vez: ou o perfil inteiro é
 * substituído, ou nada muda. Restaurar pela metade seria pior que não restaurar.
 */
export async function restoreStudy(profile: string, plan: RestorePlan) {
  const tables = collections.map(name => db.table(name));
  await db.transaction('rw', tables, async () => {
    for (const name of collections) {
      await db.table(name).where('userId').equals(profile).delete();
      const rows = (plan.backup.data[name] ?? []).map(row => ({ ...(row as Record<string, unknown>), userId: profile }));
      if (rows.length) await db.table(name).bulkPut(rows);
    }
  });
  // O marcador de sincronia descreve um estado que acabou de deixar de valer.
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('artx-study-sync:') && key.endsWith(`:${profile}`)) localStorage.removeItem(key);
  }
}
