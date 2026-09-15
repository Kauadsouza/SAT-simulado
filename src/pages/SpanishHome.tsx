import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpanishWorkspace, SpanishNote } from '../components/learning/SpanishWorkspace';
import { SPANISH_VARIANTS, type SpanishLevel, type SpanishVariant } from '../lib/spanish-hub';
import { localDate, studyBudget, weeklyActivity } from '../lib/learning-hub';
import { SPANISH_ACTIVITIES, SPANISH_UNITS } from '../data/spanish';

export function SpanishHome() {
  const { state, save, busy } = useSpanishWorkspace();
  const [editing, setEditing] = useState(false);
  const today = localDate();
  const budget = studyBudget(state.settings.minutes);
  const done = state.days[today]?.done ?? [];
  const week = weeklyActivity(state);
  const activeDays = week.filter(day => day.minutes > 0).length;
  const reviewDate = new Date(state.settings.reviewDate + 'T12:00:00');
  const variantMeta = SPANISH_VARIANTS[state.settings.variant];
  const units = SPANISH_UNITS.filter(unit => unit.level === state.settings.level);
  const lastAttempt = state.attempts[state.attempts.length - 1];
  const coursesRunning = Object.values(state.courses).filter(course => course.status === 'in_progress').length;

  return <div className="learn-page">
    <section className="learn-hero learn-hero-compact">
      <div>
        <span className="learn-eyebrow">{variantMeta.label} · {state.settings.level}</span>
        <h1>Seu espanhol.<br /><em>Um passo por dia.</em></h1>
        <p>{variantMeta.context}. Você já entende muito: o trabalho é separar o espanhol do português.</p>
        <div className="learn-actions">
          <Link className="learn-button primary" to={SPANISH_ACTIVITIES.find(item => !done.includes(item.id))?.to ?? '/espanhol/praticar'}>{done.length >= 4 ? 'Praticar mais' : 'Começar meu próximo passo'} →</Link>
          <button className="learn-button" onClick={() => setEditing(!editing)} aria-expanded={editing}>Ajustar plano</button>
        </div>
      </div>
      <div className="learn-hero-board">
        <span>Seu plano de hoje</span>
        <div className="learn-progress-ring" style={{ background: `conic-gradient(#316850 ${Math.min(done.length, 4) * 25}%, #335d4d20 0)` }}><strong>{done.length}<small>de 4 atividades</small></strong></div>
        <progress className="sr-only" value={done.length} max={4} aria-label="Atividades marcadas hoje" />
        <div className="learn-between"><strong>{state.settings.minutes} min / sessão</strong><span>{state.settings.days} dias / semana</span></div>
      </div>
    </section>

    {editing && <form className="learn-card learn-settings" onSubmit={async e => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const settings = {
        level: String(data.get('level')) as SpanishLevel,
        variant: String(data.get('variant')) as SpanishVariant,
        minutes: Number(data.get('minutes')),
        days: Number(data.get('days')),
        reviewDate: String(data.get('date')),
      };
      if (await save(s => { s.settings = settings; })) setEditing(false);
    }}>
      <div><h2>Um plano que cabe na sua semana</h2><p>A data é uma revisão de progresso. Você pode mudá-la a qualquer momento.</p></div>
      <div className="learn-form-grid">
        <label>Nível de prática<select name="level" defaultValue={state.settings.level}>{['A1', 'A2', 'B1', 'B2'].map(l => <option key={l}>{l}</option>)}</select></label>
        <label>Variedade<select name="variant" defaultValue={state.settings.variant}>{(Object.keys(SPANISH_VARIANTS) as SpanishVariant[]).map(key => <option key={key} value={key}>{SPANISH_VARIANTS[key].shortLabel}</option>)}</select></label>
        <label>Tempo por sessão<select name="minutes" defaultValue={state.settings.minutes}>{[15, 30, 45, 60].map(n => <option key={n} value={n}>{n} minutos</option>)}</select></label>
        <label>Dias por semana<select name="days" defaultValue={state.settings.days}>{[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} dias</option>)}</select></label>
        <label>Revisar o plano em<input type="date" name="date" required min={today} defaultValue={state.settings.reviewDate} /></label>
      </div>
      <button className="learn-button primary" disabled={busy}>Salvar plano</button>
    </form>}

    <div className="learn-stats">
      <div><span>Últimos 7 dias</span><strong>{activeDays}<small> dias com estudo registrado</small></strong></div>
      <div><span>Tempo que você registrou</span><strong>{week.reduce((n, d) => n + d.minutes, 0)}<small> minutos nesta semana</small></strong></div>
      <div><span>Último simulado</span><strong>{lastAttempt ? `${lastAttempt.correct}/${lastAttempt.total}` : '—'}<small>{lastAttempt ? ` em ${new Date(lastAttempt.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}` : ' ainda sem tentativas'}</small></strong></div>
    </div>

    <div className="learn-columns">
      <section className="learn-card">
        <div className="learn-section-head"><div><span className="learn-eyebrow">SEU PRÓXIMO PASSO</span><h2>Seu roteiro de hoje</h2></div><span className="learn-pill">{done.length} / 4 feitos</span></div>
        <p>Abra uma atividade. Marque ao terminar.</p>
        <div className="learn-checklist">{SPANISH_ACTIVITIES.map((item, index) => <div key={item.id} className={done.includes(item.id) ? 'done' : ''}>
          <input type="checkbox" aria-label={`Concluir: ${item.name}`} checked={done.includes(item.id)} disabled={busy} onChange={() => save(s => {
            const previous = s.days[today] ?? { done: [], minutes: 0 };
            const next = previous.done.includes(item.id) ? previous.done.filter(id => id !== item.id) : [...previous.done, item.id];
            s.days[today] = { done: next, minutes: next.reduce((n, id) => n + (budget[SPANISH_ACTIVITIES.findIndex(i => i.id === id)] ?? 0), 0) };
          })} />
          <span className="learn-task-symbol">{item.symbol}</span>
          <div><Link to={item.to}>{item.name} ↗</Link><p>{item.detail}</p></div>
          <span>{budget[index]} min</span>
        </div>)}</div>
        <small>Tempo estimado pelas atividades que você marcou; não é um cronômetro automático.</small>
      </section>

      <aside className="learn-card learn-week">
        <span className="learn-eyebrow">CONSISTÊNCIA, SEM PRESSÃO</span>
        <h2>Sua semana</h2>
        <div className="learn-week-bars">{week.map(day => <div key={day.date}><div className="learn-bar-track"><i style={{ height: `${Math.min(100, day.minutes / Math.max(state.settings.minutes, 1) * 100)}%` }} /></div><strong>{day.minutes}′</strong><span>{day.label}</span></div>)}</div>
        <p>Perdeu um dia? Retome no próximo. Você não precisa compensar tudo de uma vez.</p>
        <Link to="/espanhol/cursos" className="learn-text-link">Encontrar minha próxima aula →</Link>
        <Link to="/espanhol/simulado" className="learn-text-link">Testar o que já entendo →</Link>
        <p className="learn-muted">Próxima revisão do plano: {reviewDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </aside>
    </div>

    <section className="learn-card">
      <div className="learn-section-head"><div><span className="learn-eyebrow">SEU NÍVEL AGORA · {state.settings.level}</span><h2>O que trabalhar nesta fase</h2></div></div>
      {units.length ? units.map(unit => <article key={unit.title} className="learn-next">
        <strong>{unit.title}</strong>
        <p>{unit.focus}</p>
        <p className="learn-muted">{unit.point}</p>
      </article>) : <p className="learn-muted">Nesta fase, siga pelas frases e pelos falsos amigos na página de prática.</p>}
      <div className="learn-actions">
        <Link className="learn-button primary" to="/espanhol/cursos">Ver os cursos gratuitos{coursesRunning ? ` · ${coursesRunning} em andamento` : ''} →</Link>
        <Link className="learn-button" to="/espanhol/praticar">Abrir a prática do nível</Link>
      </div>
    </section>

    <details className="learn-card"><summary>Meu caderno de espanhol</summary><SpanishNote id="progreso" title="Meu registro de evolução" placeholder="Data · o que já consigo dizer · o que ainda trava · uma frase que quero revisar…" /></details>
  </div>;
}
