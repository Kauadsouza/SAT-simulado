import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLearningWorkspace, Note } from '../components/learning/Workspace';
import { ENGLISH_VARIANTS, localDate, studyBudget, weeklyActivity, type LearningLevel } from '../lib/learning-hub';
import { milestones } from '../data/learning-hub';


const activities = [
  { id: 'listen', name: 'Ouvir e entender', detail: 'Um trecho curto. Primeiro sem legenda, depois confira.', to: '/cursos', symbol: '♫' },
  { id: 'practice', name: 'Usar o que aprendeu', detail: 'Leia, responda e escreva algumas frases suas.', to: '/praticar', symbol: 'Aa' },
  { id: 'speak', name: 'Falar em voz alta', detail: 'Uma situação simples, sem precisar falar perfeito.', to: '/conversacao', symbol: 'Hi!' },
  { id: 'review', name: 'Lembrar sem olhar', detail: 'Revise suas frases antes de consultar a resposta.', to: '/praticar#revisao', symbol: '↻' },
];
export function LearningHome() {
  const { state, save, busy } = useLearningWorkspace();
  const [editing, setEditing] = useState(false);
  const today = localDate();
  const budget = studyBudget(state.settings.minutes);
  const done = state.days[today]?.done ?? [];
  const week = weeklyActivity(state);
  const activeDays = week.filter(day => day.minutes > 0).length;
  const reviewDate = new Date(state.settings.reviewDate + 'T12:00:00');
  const variant = state.settings.variant;
  const variantMeta = ENGLISH_VARIANTS[variant];
  const isBritish = variant === 'british';
  return <div className="learn-page">
    <section className="learn-hero learn-hero-compact">
      <div><span className="learn-eyebrow">{variantMeta.label} · {state.settings.level}</span><h1>Seu inglês.<br /><em>Um passo por dia.</em></h1><p>{isBritish ? 'Pratique para a vida em Oxford.' : 'Explore o inglês dos Estados Unidos.'}</p><div className="learn-actions"><Link className="learn-button primary" to={activities.find(item => !done.includes(item.id))?.to ?? '/praticar'}>{done.length >= 4 ? 'Praticar mais' : 'Começar meu próximo passo'} →</Link><button className="learn-button" onClick={() => setEditing(!editing)} aria-expanded={editing}>Ajustar plano</button></div></div>
      <div className="learn-hero-board"><span>Seu plano de hoje</span><div className="learn-progress-ring" style={{ background: `conic-gradient(#316850 ${Math.min(done.length, 4) * 25}%, #335d4d20 0)` }}><strong>{done.length}<small>de 4 atividades</small></strong></div><progress className="sr-only" value={done.length} max={4} aria-label="Atividades marcadas hoje" /><div className="learn-between"><strong>{state.settings.minutes} min / sessão</strong><span>{state.settings.days} dias / semana</span></div></div>
    </section>
    {editing && <form className="learn-card learn-settings" onSubmit={async e => {
      e.preventDefault(); const data = new FormData(e.currentTarget);
      const settings = { level: String(data.get('level')) as LearningLevel, variant: state.settings.variant, minutes: Number(data.get('minutes')), days: Number(data.get('days')), reviewDate: String(data.get('date')) };
      if (await save(s => { s.settings = settings; })) setEditing(false);
    }}><div><h2>Um plano que cabe na sua semana</h2><p>A data é uma revisão de progresso. Você pode mudá-la a qualquer momento.</p></div><div className="learn-form-grid">
      <label>Nível de prática<select name="level" defaultValue={state.settings.level}>{['A1', 'A2', 'B1', 'B2'].map(l => <option key={l}>{l}</option>)}</select></label>
      <label>Tempo por sessão<select name="minutes" defaultValue={state.settings.minutes}>{[15, 30, 45, 60].map(n => <option key={n} value={n}>{n} minutos</option>)}</select></label>
      <label>Dias por semana<select name="days" defaultValue={state.settings.days}>{[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} dias</option>)}</select></label>
      <label>Revisar o plano em<input type="date" name="date" required min={today} defaultValue={state.settings.reviewDate} /></label>
    </div><button className="learn-button primary" disabled={busy}>Salvar plano</button></form>}
    <div className="learn-stats"><div><span>Últimos 7 dias</span><strong>{activeDays}<small> dias com estudo registrado</small></strong></div><div><span>Tempo que você registrou</span><strong>{week.reduce((n, d) => n + d.minutes, 0)}<small> minutos nesta semana</small></strong></div><div><span>Próxima revisão do plano</span><strong className="learn-date">{reviewDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div></div>
    <div className="learn-columns"><section className="learn-card"><div className="learn-section-head"><div><span className="learn-eyebrow">SEU PRÓXIMO PASSO</span><h2>Seu roteiro de hoje</h2></div><span className="learn-pill">{done.length} / 4 feitos</span></div><p>Abra uma atividade. Marque ao terminar.</p><div className="learn-checklist">{activities.map((item, index) => <div key={item.id} className={done.includes(item.id) ? 'done' : ''}><input type="checkbox" aria-label={`Concluir: ${item.name}`} checked={done.includes(item.id)} disabled={busy} onChange={() => save(s => {
        const previous = s.days[today] ?? { done: [], minutes: 0 };
        const next = previous.done.includes(item.id) ? previous.done.filter(id => id !== item.id) : [...previous.done, item.id];
        s.days[today] = { done: next, minutes: next.reduce((n, id) => n + (budget[activities.findIndex(i => i.id === id)] ?? 0), 0) };
      })} /><span className="learn-task-symbol">{item.symbol}</span><div><Link to={item.to}>{item.name} ↗</Link><p>{item.detail}</p></div><span>{budget[index]} min</span></div>)}</div><small>Tempo estimado pelas atividades que você marcou; não é um cronômetro automático.</small></section>
    <aside className="learn-card learn-week"><span className="learn-eyebrow">CONSISTÊNCIA, SEM PRESSÃO</span><h2>Sua semana</h2><div className="learn-week-bars">{week.map(day => <div key={day.date}><div className="learn-bar-track"><i style={{ height: `${Math.min(100, day.minutes / Math.max(state.settings.minutes, 1) * 100)}%` }} /></div><strong>{day.minutes}′</strong><span>{day.label}</span></div>)}</div><p>Perdeu um dia? Retome no próximo. Você não precisa compensar tudo de uma vez.</p><Link to="/cursos" className="learn-text-link">Encontrar minha próxima aula →</Link></aside></div>
    <details className="learn-card"><summary>Minha evolução · ver etapas e metas</summary><div className="learn-section-head"><div><span className="learn-eyebrow">PROGRESSO QUE DÁ PARA PERCEBER</span><h2>Avance pelo que consegue fazer</h2></div></div><p className="learn-muted">A cada quatro semanas, repita uma tarefa antiga. As etapas não têm prazo obrigatório nem certificam um nível.</p><div className="learn-milestones">{milestones.map((step, index) => <article className="learn-card" key={step.title}><span className="learn-step-number">0{index + 1}</span><small>{step.label}</small><h3>{step.title}</h3><p>{step.description}</p>{step.tasks.map((task, taskIndex) => <label className="learn-check-label" key={task}><input type="checkbox" checked={state.checks[`milestone-${index}`]?.[taskIndex] ?? false} disabled={busy} onChange={e => { const checked = e.target.checked; void save(s => { const checks = [...(s.checks[`milestone-${index}`] ?? [false, false, false])]; checks[taskIndex] = checked; s.checks[`milestone-${index}`] = checks; }); }} /><span>{task}</span></label>)}</article>)}</div></details>
    <details className="learn-card"><summary>Meu caderno de evolução</summary><Note id="progress-review" title="Meu registro de evolução" placeholder="Data · o que já consigo fazer · o que ainda trava · uma frase que quero revisar…" /></details>
  </div>;
}
