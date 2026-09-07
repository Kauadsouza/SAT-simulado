import { useState } from 'react';
import { RESEARCH_DATE } from '../data/learning-hub';
import { courseRoadmapByVariant, englishCoursesByVariant, primaryCourseByVariant } from '../data/english-variants';
import { ENGLISH_VARIANTS } from '../lib/learning-hub';
import { useLearningWorkspace, PageHeading, ExternalLink, Note } from '../components/learning/Workspace';
import type { CourseStatus } from '../lib/learning-hub';

export function EnglishCourses() {
  const { state, save, busy } = useLearningWorkspace();
  const [filter, setFilter] = useState('Todos');
  const levels = ['A1', 'A2', 'B1', 'B2'];
  const variant = state.settings.variant;
  const variantMeta = ENGLISH_VARIANTS[variant];
  const allCourses = englishCoursesByVariant[variant];
  const primaryCourse = primaryCourseByVariant[variant];
  const courses = allCourses.filter(c => {
    if (filter === 'Todos') return true;
    if (filter === 'Em andamento') return state.courses[c.id]?.status === 'in_progress';
    const [start, end = start] = c.level.split('–');
    return levels.indexOf(filter) >= levels.indexOf(start) && levels.indexOf(filter) <= levels.indexOf(end);
  });
  return <div className="learn-page"><PageHeading eyebrow={`${variantMeta.label.toUpperCase()} · ${allCourses.length} RECURSOS GRATUITOS`} title="Escolha sua próxima aula." text="Abra um curso, pratique e marque seu andamento." />
    <div className="learn-banner"><span className="learn-task-symbol">01</span><div><strong>{variant === 'british' ? 'Comece por “Meeting new people” no British Council.' : 'Comece pela Lesson 1 da VOA ou pela Unit 1 do USA Learns.'}</strong><p>{variant === 'british' ? 'Ouça, repita e use a apresentação na prática interna. Depois avance para café, horários, transporte e vida acadêmica.' : 'Estude um trecho de cada vez, repita em voz alta e volte à prática interna para usar o mesmo assunto.'}</p></div><ExternalLink href={primaryCourse.url} className="learn-button primary">Abrir curso principal</ExternalLink></div>
    <details><summary>Entender os níveis · A1 → B2</summary><div className="learn-section-head"><div><span className="learn-eyebrow">CURSO ORGANIZADO · A1 → B2</span><h2>Uma rota clara, sem misturar variedades</h2></div><span className="learn-pill">{variantMeta.shortLabel}</span></div><div className="learn-roadmap">{courseRoadmapByVariant[variant].map((step, index) => <article className="learn-card" key={step.level}><span className="learn-step-number">0{index + 1}</span><small>{step.level}</small><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></details>
    <div className="learn-filter" role="group" aria-label="Filtrar cursos">{['Todos', 'A1', 'A2', 'B1', 'B2', 'Em andamento'].map(f => <button className={filter === f ? 'selected' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)} key={f}>{f}</button>)}</div>
    <div className="learn-course-grid">{courses.map(c => <article className="learn-card learn-course" key={c.id}><div className={`learn-cover ${c.color}`}><span>{c.skill}</span><strong aria-hidden="true">{c.mark}</strong><div><span>{c.level}</span><span>{c.type}</span></div></div><div className="learn-course-body"><span className="learn-eyebrow">{c.provider}</span><h2>{c.title}</h2><details><summary>Sobre a aula e como estudar</summary><p>{c.description}</p><div className="learn-next"><strong>Sua tarefa</strong><p>{c.action}</p></div></details><ExternalLink href={c.url} className="learn-button primary">Abrir aula</ExternalLink><label className="learn-course-status">Meu andamento<select aria-label={`Andamento: ${c.title}`} value={state.courses[c.id]?.status ?? 'not_started'} disabled={busy} onChange={e => { const status = e.target.value as CourseStatus; void save(s => { s.courses[c.id] = { ...s.courses[c.id], note: s.courses[c.id]?.note ?? '', status }; }); }}><option value="not_started">Não iniciado</option><option value="in_progress">Em andamento</option><option value="completed">Finalizado</option></select></label><details><summary>Anotar onde parei</summary><Note id={`course-${c.id}`} /></details></div></article>)}</div>
    {!courses.length && <div className="learn-card">Nenhum curso neste filtro ainda. Escolha “Em andamento” em um curso para encontrá-lo aqui.</div>}
    <details><summary>Gratuidade e fontes</summary><p className="learn-source">Links oficiais conferidos em {RESEARCH_DATE}. O material indicado é gratuito; cadastro pode ser necessário em alguns cursos. Serviços extras podem ser pagos e esta seleção não promete certificado gratuito. Seu andamento aqui é manual e não é importado dos sites.</p></details>
  </div>;
}
