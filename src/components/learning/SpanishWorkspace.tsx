import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { liveQuery } from 'dexie';
import { useAppStore } from '../../store/appStore';
import { db } from '../../db';
import { getSpanishHub, updateSpanishHub, type SpanishHubState } from '../../lib/spanish-hub';

type SpanishContext = { state: SpanishHubState; userId: string; save: (edit: (state: SpanishHubState) => void) => Promise<boolean>; busy: boolean };
const Context = createContext<SpanishContext | null>(null);

export function SpanishWorkspace({ children }: { children: ReactNode }) {
  const userId = useAppStore(s => s.user!.name);
  const [state, setState] = useState<SpanishHubState | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const subscription = liveQuery(() => db.englishEngine.get(userId)).subscribe({ next: row => setState(getSpanishHub(row?.spanishHub)), error: () => setError('Não foi possível abrir seu progresso. Recarregue a página; seus dados não foram apagados.') });
    return () => subscription.unsubscribe();
  }, [userId]);
  async function save(edit: (value: SpanishHubState) => void) {
    setPending(n => n + 1); setSaved(false); setError('');
    try { const next = await updateSpanishHub(userId, edit); setState(next); setSaved(true); return true; }
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
export function useSpanishWorkspace() {
  const context = useContext(Context);
  if (!context) throw new Error('SpanishWorkspace ausente');
  return context;
}

export function SpanishNote({ id, title = 'Onde parei', placeholder = 'Uma frase nova, uma dúvida ou o próximo passo…' }: { id: string; title?: string; placeholder?: string }) {
  const { state, save, busy } = useSpanishWorkspace();
  const [draft, setDraft] = useState<string | null>(null);
  const stored = state.journal[id] ?? '';
  return <form className="learn-note" data-private onSubmit={async e => { e.preventDefault(); if (await save(s => { s.journal[id] = (draft ?? stored).trim(); })) setDraft(null); }}>
    <label htmlFor={`nota-${id}`}>{title}</label>
    <textarea id={`nota-${id}`} maxLength={5000} rows={4} placeholder={placeholder} value={draft ?? stored} onChange={e => setDraft(e.target.value)} />
    <div className="learn-between"><small>{draft === null ? 'Sua anotação fica no seu caderno.' : 'Alterações ainda não salvas.'}</small><button className="learn-button small" disabled={busy || draft === null}>Salvar anotação</button></div>
  </form>;
}
