import { useEffect, useRef, useState, type ReactNode } from 'react';
import { liveQuery } from 'dexie';
import { accountRequest, type AccountSession } from './MemberAccess';
import { useAppStore } from '../store/appStore';
import { studySnapshot } from '../lib/study-sync';
import { db } from '../db';
const collections = ['sessions','englishProgress','englishEngine','srsCards','generatedContent'] as const;
function serialize(value: unknown) { return JSON.stringify(value, (_key,item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))) : item); }

export function MemberStudy({ session, children }: { session: AccountSession; children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('Abrindo seu caderno…');
  const revision = useRef(0);
  const lastSaved = useRef('');
  useEffect(() => {
    let active = true; let saving = false; let queued = false; let timer: ReturnType<typeof setTimeout>;
    let subscription: { unsubscribe: () => void } | undefined;
    const profile = session.principal;
    const markerKey = `artx-member-study:${profile}`;
    useAppStore.getState().login(profile);
    async function save() {
      if (!active) return;
      if (saving) { queued = true; return; }
      saving = true;
      try {
        const payload = await studySnapshot(profile); const text = serialize(payload);
        if (text !== lastSaved.current) {
          setStatus('Sincronizando…');
          const result = await accountRequest('save', 'study', { payload, revision: revision.current }, session.token);
          if (!active) return;
          revision.current = result.revision; lastSaved.current = text;
          localStorage.setItem(markerKey, JSON.stringify({ revision: result.revision, text }));
        }
        if (active) setStatus('Progresso salvo na sua conta');
      } catch(e) { if (active) setStatus(e instanceof Error ? e.message : 'Falha ao sincronizar. A cópia local foi mantida.'); }
      finally { saving = false; if (queued && active) { queued = false; void save(); } }
    }
    void (async () => {
      try {
        await accountRequest('session','study',{},session.token);
        const local = await studySnapshot(profile); const localText = serialize(local);
        const marker = JSON.parse(localStorage.getItem(markerKey) ?? 'null') as { revision: number; text: string } | null;
        const remote = await accountRequest('load','study',{},session.token);
        if (!active) return;
        if (remote) {
          const remoteText = serialize(remote.payload);
          const dirty = marker ? marker.text !== localText : Object.values(local).some(rows => rows.length > 0);
          if (dirty && remoteText !== localText && (!marker || marker.revision !== remote.revision)) throw new Error('Há progresso diferente em outro dispositivo. As duas cópias foram preservadas.');
          if (!dirty && remoteText !== localText) {
            for (const name of collections) if (!Array.isArray(remote.payload[name]) || remote.payload[name].some((row: { userId?: string }) => row?.userId !== profile)) throw new Error('Backup incompatível; nenhum dado foi alterado.');
            await db.transaction('rw', collections.map(name => db.table(name)), async () => { for (const name of collections) { await db.table(name).where('userId').equals(profile).delete(); await db.table(name).bulkPut(remote.payload[name]); } });
          }
          revision.current = remote.revision; lastSaved.current = remoteText;
        } else { revision.current = 0; lastSaved.current = ''; }
        if (!active) return;
        setReady(true);
        subscription = liveQuery(() => studySnapshot(profile)).subscribe(() => { clearTimeout(timer); timer = setTimeout(() => void save(), 900); });
        void save();
      } catch(e) { if (active) setStatus(e instanceof Error ? e.message : 'Não foi possível abrir seu caderno.'); }
    })();
    const retry = () => void save(); window.addEventListener('online',retry);
    return () => { active = false; clearTimeout(timer); subscription?.unsubscribe(); window.removeEventListener('online',retry); };
  }, [session.principal, session.token]);
  if (!ready) return <main className="study-access"><h1>Seu caderno privado</h1><p role="status">{status}</p><button onClick={() => window.location.reload()}>Tentar novamente</button></main>;
  return <><div className="study-sync-bar" role="status">{status}</div>{children}</>;
}
