import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { liveQuery } from 'dexie';
import { useAppStore } from '../../store/appStore';
import { db } from '../../db';
import { getLearningHub, updateLearningHub, type LearningHubState } from '../../lib/learning-hub';

type WorkspaceContext = { state: LearningHubState; userId: string; save: (edit: (state: LearningHubState) => void) => Promise<boolean>; busy: boolean };
const Context = createContext<WorkspaceContext | null>(null);
export function LearningWorkspace({ children }: { children: ReactNode }) {
  const userId = useAppStore(s => s.user!.name);
  const [state, setState] = useState<LearningHubState | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const subscription = liveQuery(() => db.englishEngine.get(userId)).subscribe({ next: row => setState(getLearningHub(row?.learningHub)), error: () => setError('Não foi possível abrir seu progresso. Recarregue a página; seus dados não foram apagados.') });
    return () => subscription.unsubscribe();
  }, [userId]);
  async function save(edit: (value: LearningHubState) => void) {
    setPending(n => n + 1); setSaved(false); setError('');
    try { const next = await updateLearningHub(userId, edit); setState(next); setSaved(true); return true; }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível salvar. Tente novamente.'); return false; }
    finally { setPending(n => n - 1); }
  }
  return <>
    {error && <div className="learn-alert" role="alert">{error}</div>}
    <div className="learn-save" role="status" aria-live="polite">{pending ? 'Salvando…' : saved ? 'Salvo neste dispositivo · veja a sincronização na barra acima' : ''}</div>
    {state ? <Context.Provider value={{ state, userId, save, busy: pending > 0 }}>{children}</Context.Provider> : <p className="study-loading">Abrindo seu caderno…</p>}
  </>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useLearningWorkspace() {
  const context = useContext(Context);
  if (!context) throw new Error('LearningWorkspace ausente');
  return context;
}
export function Note({ id, title = 'Onde parei', placeholder = 'Aula, minuto do vídeo, uma dúvida ou o próximo passo…' }: { id: string; title?: string; placeholder?: string }) {
  const { state, save, busy } = useLearningWorkspace();
  const [draft, setDraft] = useState<string | null>(null);
  const stored = state.journal[id] ?? '';
  return <form className="learn-note" data-private onSubmit={async e => { e.preventDefault(); if (await save(s => { s.journal[id] = (draft ?? stored).trim(); })) setDraft(null); }}>
    <label htmlFor={`note-${id}`}>{title}</label>
    <textarea id={`note-${id}`} maxLength={5000} rows={4} placeholder={placeholder} value={draft ?? stored} onChange={e => setDraft(e.target.value)} />
    <div className="learn-between"><small>{draft === null ? 'Sua anotação fica no seu caderno.' : 'Alterações ainda não salvas.'}</small><button className="learn-button small" disabled={busy || draft === null}>Salvar anotação</button></div>
  </form>;
}
export function ExternalLink({ href, children, className = 'learn-button' }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span><span className="sr-only"> (abre em outra guia)</span></a>;
}
export function PageHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="learn-heading"><span className="learn-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>;
}
