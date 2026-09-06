import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLearningWorkspace, Note } from '../components/learning/Workspace';
import { localDate, studyBudget, weeklyActivity, type LearningLevel } from '../lib/learning-hub';
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
  return <div className="learn-page">
    <section className="learn-hero">
      <div><span className="learn-eyebrow">INGLÊS PARA A SUA VIDA</span><h1>Mais confiança.<br /><em>Uma conversa de cada vez.</em></h1><p>Você já entende palavras e frases simples. Agora vamos transformar essa base em inglês que você consegue usar.</p><div className="learn-actions"><Link className="learn-button primary" to="/praticar">Começar a prática <span>→</span></Link><button className="learn-button" onClick={() => setEditing(!editing)} aria-expanded={editing}>Ajustar meu plano</button></div><span className="learn-hero-foot">Básico como ponto de partida · ritmo flexível · sem depender da imersão</span></div>
      <div className="learn-hero-board" aria-label="Resumo do plano"><div className="learn-between"><span>SEU RITMO ATUAL</span><span className="learn-dot" /></div><div className="learn-big-number">{state.settings.minutes}<span>min / sessão</span></div><div className="learn-wave" aria-hidden="true">{[20, 40, 65, 35, 90, 55, 110, 72, 48, 85, 40, 60, 25].map((height, i) => <i key={i} style={{ height }} />)}</div><div className="learn-between"><strong>{state.settings.days} dias por semana</strong><span>nível de prática {state.settings.level}</span></div><p>Comece pequeno. Se ficar pesado, reduza o ritmo e continue de onde parou.</p></div>
    </section>
    {editing && <form className="learn-card learn-settings" onSubmit={async e => {
      e.preventDefault(); const data = new FormData(e.currentTarget);
      const settings = { level: String(data.get('level')) as LearningLevel, minutes: Number(data.get('minutes')), days: Number(data.get('days')), reviewDate: String(data.get('date')) };
      if (await save(s => { s.settings = settings; })) setEditing(false);
    }}><div><h2>Um plano que cabe na sua semana</h2><p>A data é uma revisão de progresso. Você pode mudá-la a qualquer momento.</p></div><div className="learn-form-grid">
      <label>Nível de prática<select name="level" defaultValue={state.settings.level}>{['A1', 'A2', 'B1', 'B2'].map(l => <option key={l}>{l}</option>)}</select></label>
      <label>Tempo por sessão<select name="minutes" defaultValue={state.settings.minutes}>{[15, 30, 45, 60].map(n => <option key={n} value={n}>{n} minutos</option>)}</select></label>
      <label>Dias por semana<select name="days" defaultValue={state.settings.days}>{[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} dias</option>)}</select></label>
      <label>Revisar o plano em<input type="date" name="date" required min={today} defaultValue={state.settings.reviewDate} /></label>
    </div><button className="learn-button primary" disabled={busy}>Salvar plano</button></form>}
    <div className="learn-stats"><div><span>Últimos 7 dias</span><strong>{activeDays}<small> dias com estudo registrado</small></strong></div><div><span>Tempo que você registrou</span><strong>{week.reduce((n, d) => n + d.minutes, 0)}<small> minutos nesta semana</small></strong></div><div><span>Próxima revisão do plano</span><strong className="learn-date">{reviewDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div></div>
    <div className="learn-columns"><section className="learn-card"><div className="learn-section-head"><div><span className="learn-eyebrow">SEU PRÓXIMO PASSO</span><h2>Uma sessão de {state.settings.minutes} minutos</h2></div><span className="learn-pill">{done.length} / 4 feitos</span></div><p>Escolha {state.settings.days} dias na semana. Hoje pode ser um deles. Marque só o que você fez.</p><div className="learn-checklist">{activities.map((item, index) => <div key={item.id} className={done.includes(item.id) ? 'done' : ''}><input type="checkbox" aria-label={`Concluir: ${item.name}`} checked={done.includes(item.id)} disabled={busy} onChange={() => save(s => {
        const previous = s.days[today] ?? { done: [], minutes: 0 };
        const next = previous.done.includes(item.id) ? previous.done.filter(id => id !== item.id) : [...previous.done, item.id];
        s.days[today] = { done: next, minutes: next.reduce((n, id) => n + (budget[activities.findIndex(i => i.id === id)] ?? 0), 0) };
      })} /><span className="learn-task-symbol">{item.symbol}</span><div><Link to={item.to}>{item.name} ↗</Link><p>{item.detail}</p></div><span>{budget[index]} min</span></div>)}</div><small>Tempo estimado pelas atividades que você marcou; não é um cronômetro automático.</small></section>
    <aside className="learn-card learn-week"><span className="learn-eyebrow">CONSISTÊNCIA, SEM PRESSÃO</span><h2>Sua semana, do seu jeito</h2><div className="learn-week-bars">{week.map(day => <div key={day.date}><div className="learn-bar-track"><i style={{ height: `${Math.min(100, day.minutes / Math.max(state.settings.minutes, 1) * 100)}%` }} /></div><strong>{day.minutes}′</strong><span>{day.label}</span></div>)}</div><p>Perdeu um dia? Retome no próximo. Você não precisa compensar tudo de uma vez.</p><Link to="/cursos" className="learn-text-link">Encontrar minha próxima aula →</Link></aside></div>
    <section><div className="learn-section-head"><div><span className="learn-eyebrow">PROGRESSO QUE DÁ PARA PERCEBER</span><h2>Avance pelo que consegue fazer</h2></div></div><p className="learn-muted">A cada quatro semanas, repita uma tarefa antiga. As etapas não têm prazo obrigatório nem certificam um nível.</p><div className="learn-milestones">{milestones.map((step, index) => <article className="learn-card" key={step.title}><span className="learn-step-number">0{index + 1}</span><small>{step.label}</small><h3>{step.title}</h3><p>{step.description}</p>{step.tasks.map((task, taskIndex) => <label className="learn-check-label" key={task}><input type="checkbox" checked={state.checks[`milestone-${index}`]?.[taskIndex] ?? false} disabled={busy} onChange={e => { const checked = e.target.checked; void save(s => { const checks = [...(s.checks[`milestone-${index}`] ?? [false, false, false])]; checks[taskIndex] = checked; s.checks[`milestone-${index}`] = checks; }); }} /><span>{task}</span></label>)}</article>)}</div></section>
    <section className="learn-card"><Note id="progress-review" title="Meu registro de evolução" placeholder="Data · o que já consigo fazer · o que ainda trava · uma frase que quero revisar…" /></section>
  </div>;
}
