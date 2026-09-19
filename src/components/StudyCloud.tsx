import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { liveQuery } from 'dexie';
import { connectStudy, disconnectStudy, studyAuth } from '../lib/cloud';
import { exportStudy, planRestore, restoreStudy, studySnapshot, syncStudy, type RestorePlan } from '../lib/study-sync';
import { useAppStore } from '../store/appStore';
import { MemberAccess } from './MemberAccess';
import { MemberStudy } from './MemberStudy';

const hubOrigin = 'https://artx-hub.vercel.app';

const collectionLabels: Record<string, string> = {
  sessions: 'Simulados feitos',
  englishProgress: 'Progresso de inglês',
  englishEngine: 'Cadernos de inglês e espanhol',
  srsCards: 'Cartões de revisão',
  generatedContent: 'Conteúdo gerado',
};

export function StudyCloud({ children }: { children: ReactNode }) {
  return <MemberAccess app="study">{session => session.owner ? <OwnerStudyCloud>{children}</OwnerStudyCloud> : <MemberStudy key={session.principal} session={session}>{children}</MemberStudy>}</MemberAccess>;
}

function OwnerStudyCloud({ children }: { children: ReactNode }) {
  const profile = useAppStore(state => state.user?.name);
  const [owner, setOwner] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [local, setLocal] = useState(false);
  const [status, setStatus] = useState('Conectando ao Hub…');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [hydrated, setHydrated] = useState('');
  const running = useRef<Promise<void> | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [plan, setPlan] = useState<RestorePlan | null>(null);

  useEffect(() => {
    let mounted = true;
    async function accept(token: string) {
      try {
        const id = await connectStudy(token);
        if (!mounted) return;
        if (!useAppStore.getState().user) useAppStore.getState().login('Kauã');
        setOwner(id); setLocal(false); setStatus('Sessão conectada');
      } catch (error) { if (mounted) setStatus(error instanceof Error ? error.message : 'Falha ao entrar.'); }
      finally { if (mounted) setReady(true); }
    }
    function onMessage(event: MessageEvent) {
      if (event.source !== window.parent || event.origin !== hubOrigin || event.data?.type !== 'ARTX_HUB_AUTH' || typeof event.data.accessToken !== 'string') return;
      void accept(event.data.accessToken);
    }
    window.addEventListener('message', onMessage);
    if (window.parent !== window) window.parent.postMessage({ type: 'ARTX_STUDY_EMBED_READY' }, hubOrigin);
    if (window.parent === window && studyAuth) void studyAuth.auth.getSession().then(({ data }) => data.session ? accept(data.session.access_token) : setReady(true)).catch(() => setReady(true));
    const subscription = window.parent === window ? studyAuth?.auth.onAuthStateChange((_event, session) => {
      if (session) void accept(session.access_token);
      else { disconnectStudy(); setOwner(null); }
    }) : undefined;
    const timer = window.setTimeout(() => { if (mounted) setReady(true); }, 10000);
    return () => { mounted = false; clearTimeout(timer); window.removeEventListener('message', onMessage); subscription?.data.subscription.unsubscribe(); };
  }, []);

  const sync = useCallback(async () => {
    if (!owner || !profile) return;
    const previous = running.current;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    running.current = gate;
    if (previous) await previous;
    try { setStatus('Sincronizando…'); await syncStudy(profile); setStatus('Progresso sincronizado'); }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Não foi possível sincronizar.'); }
    finally { release(); if (running.current === gate) running.current = null; }
  }, [owner, profile]);

  useEffect(() => {
    if (!owner || !profile) return;
    let active = true;
    void Promise.resolve().then(sync).finally(() => { if (active) setHydrated(`${owner}:${profile}`); });
    return () => { active = false; };
  }, [owner, profile, sync]);

  useEffect(() => {
    if (!owner || !profile || hydrated !== `${owner}:${profile}`) return;
    let timer: ReturnType<typeof setTimeout>;
    const subscription = liveQuery(() => studySnapshot(profile)).subscribe(() => { clearTimeout(timer); timer = setTimeout(() => void sync(), 900); });
    const refresh = () => { if (document.visibilityState === 'visible') void sync(); };
    window.addEventListener('online', refresh); window.addEventListener('focus', refresh);
    return () => { subscription.unsubscribe(); clearTimeout(timer); window.removeEventListener('online', refresh); window.removeEventListener('focus', refresh); };
  }, [owner, profile, sync, hydrated]);

  useEffect(() => {
    if (window.parent === window) return;
    const healthy = status === 'Progresso sincronizado';
    const syncing = /conectando|sincronizando|conectada/i.test(status);
    window.parent.postMessage({
      type: 'ARTX_SYSTEM_STATUS',
      system: 'sat',
      state: healthy ? 'ready' : syncing ? 'syncing' : 'attention',
      title: healthy ? 'Idiomas sincronizados' : syncing ? 'Sincronizando idiomas' : 'Idiomas precisa de atenção',
      detail: `${profile ?? 'Kauã'} · ${status}`.slice(0, 180),
    }, hubOrigin);
  }, [profile, status]);

  if (!ready || (owner && profile && hydrated !== `${owner}:${profile}`)) return <main className="study-access"><h1>Seus idiomas, no seu ritmo.</h1><p>{status}</p></main>;
  if (!owner && !local) return <main className="study-access"><form onSubmit={async event => { event.preventDefault(); if (!studyAuth || pending) return; setPending(true); try { const { error } = await studyAuth.auth.signInWithPassword({ email: email.trim(), password }); if (error) setStatus('Não foi possível entrar. Confira seus dados e a conexão.'); } catch { setStatus('Falha de conexão. Tente novamente.'); } finally { setPending(false); setPassword(''); } }}><small>ARTX / ESTUDOS</small><h1>Um novo dia.<br />Um passo no idioma.</h1><p>Use o mesmo acesso do Hub para guardar seu progresso entre dispositivos.</p><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></label><label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></label><p role="status">{status}</p><button disabled={pending || !studyAuth}>{pending ? 'Entrando…' : 'Entrar e sincronizar'}</button><a href={hubOrigin} target="_top">Abrir pelo ARTX Hub ↗</a><button type="button" className="study-local" onClick={() => { setLocal(true); setStatus('Somente neste dispositivo'); }}>Continuar com o histórico local</button></form></main>;
  return <><div className="study-sync-bar" role="status"><span>{owner ? status : 'Modo local · progresso somente neste dispositivo'}</span><div>{owner && <button onClick={() => void sync()}>Sincronizar</button>}{profile && <button onClick={() => void exportStudy(profile)}>Exportar backup</button>}{profile && <button onClick={() => fileInput.current?.click()}>Restaurar</button>}{owner && window.parent === window && <button onClick={async () => {
    try {
      const result = await studyAuth?.auth.signOut({ scope: 'local' });
      if (result?.error) throw result.error;
      disconnectStudy(); setOwner(null); setLocal(false); setHydrated('');
      setStatus('Você saiu da conta. O histórico local foi preservado.');
    } catch { setStatus('Não foi possível sair da conta. Confira a conexão e tente novamente.'); }
  }}>Sair da conta</button>}</div></div>
  <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try { setPlan(planRestore(await file.text())); }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Não foi possível ler o arquivo.'); }
  }} />
  {plan && profile && <div className="study-restore" role="dialog" aria-modal="true" aria-labelledby="restore-title">
    <div>
      <h2 id="restore-title">Restaurar backup em “{profile}”?</h2>
      <p>Exportado em {plan.backup.exportedAt ? new Date(plan.backup.exportedAt).toLocaleString('pt-BR') : 'data não informada'}{plan.backup.profile && plan.backup.profile !== profile ? ` pelo perfil “${plan.backup.profile}”` : ''}.</p>
      <ul>
        {Object.entries(plan.counts).map(([name, count]) => <li key={name}><span>{collectionLabels[name] ?? name}</span><strong>{count}</strong></li>)}
      </ul>
      <p className="study-restore-warning">Isto <strong>substitui</strong> o progresso atual do perfil “{profile}”. O que estiver só neste dispositivo e não estiver no arquivo será perdido. Exporte um backup antes se tiver dúvida.</p>
      <div>
        <button onClick={() => setPlan(null)}>Cancelar</button>
        <button className="study-restore-confirm" disabled={plan.total === 0} onClick={async () => {
          try {
            await restoreStudy(profile, plan);
            setPlan(null);
            setStatus(`Backup restaurado: ${plan.total} registros. Recarregando…`);
            setTimeout(() => window.location.reload(), 900);
          } catch { setStatus('Não foi possível restaurar. Seu progresso atual continua intacto.'); }
        }}>{plan.total === 0 ? 'Arquivo vazio' : `Restaurar ${plan.total} registros`}</button>
      </div>
    </div>
  </div>}
  {children}</>;
}
