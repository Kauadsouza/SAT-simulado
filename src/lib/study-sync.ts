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
