import { useState } from 'react';
import { englishCourses, RESEARCH_DATE } from '../data/learning-hub';
import { useLearningWorkspace, PageHeading, ExternalLink, Note } from '../components/learning/Workspace';
import type { CourseStatus } from '../lib/learning-hub';

export function EnglishCourses() {
  const { state, save, busy } = useLearningWorkspace();
  const [filter, setFilter] = useState('Todos');
  const levels = ['A1', 'A2', 'B1', 'B2'];
  const courses = englishCourses.filter(c => {
    if (filter === 'Todos') return true;
    if (filter === 'Em andamento') return state.courses[c.id]?.status === 'in_progress';
    const [start, end = start] = c.level.split('–');
    return levels.indexOf(filter) >= levels.indexOf(start) && levels.indexOf(filter) <= levels.indexOf(end);
  });
  return <div className="learn-page"><PageHeading eyebrow="SUA BIBLIOTECA · 8 RECURSOS GRATUITOS" title="Um caminho para começar. Espaço para ir além." text="Use o curso da VOA como trilha principal e os outros recursos para praticar habilidades. Você não precisa fazer tudo ao mesmo tempo." />
    <div className="learn-banner"><span className="learn-task-symbol">01</span><div><strong>Comece pela primeira lição da VOA.</strong><p>Estude um trecho de cada vez. Acompanhe com listening e conversação A1; avance quando estiver confortável.</p></div><ExternalLink href={englishCourses[0].url} className="learn-button primary">Abrir curso</ExternalLink></div>
    <div className="learn-filter" role="group" aria-label="Filtrar cursos">{['Todos', 'A1', 'A2', 'B1', 'B2', 'Em andamento'].map(f => <button className={filter === f ? 'selected' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)} key={f}>{f}</button>)}</div>
    <div className="learn-course-grid">{courses.map(c => <article className="learn-card learn-course" key={c.id}><div className={`learn-cover ${c.color}`}><span>{c.skill}</span><strong aria-hidden="true">{c.mark}</strong><div><span>{c.level}</span><span>{c.type}</span></div></div><div className="learn-course-body"><span className="learn-eyebrow">{c.provider}</span><h2>{c.title}</h2><p>{c.description}</p><div className="learn-next"><strong>Como estudar</strong><p>{c.action}</p></div><ExternalLink href={c.url} className="learn-button primary">Ir para o conteúdo</ExternalLink><label className="learn-course-status">Meu andamento<select aria-label={`Andamento: ${c.title}`} value={state.courses[c.id]?.status ?? 'not_started'} disabled={busy} onChange={e => { const status = e.target.value as CourseStatus; void save(s => { s.courses[c.id] = { ...s.courses[c.id], note: s.courses[c.id]?.note ?? '', status }; }); }}><option value="not_started">Não iniciado</option><option value="in_progress">Em andamento</option><option value="completed">Finalizado</option></select></label><details><summary>Anotar onde parei</summary><Note id={`course-${c.id}`} /></details></div></article>)}</div>
    {!courses.length && <div className="learn-card">Nenhum curso neste filtro ainda. Escolha “Em andamento” em um curso para encontrá-lo aqui.</div>}
    <p className="learn-source">Links oficiais conferidos em {RESEARCH_DATE}. O material indicado é gratuito. Serviços extras podem ser pagos; esta seleção não promete certificados gratuitos. Seu andamento aqui é manual e não é importado dos sites.</p>
  </div>;
}
