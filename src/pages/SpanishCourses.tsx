import { useState } from 'react';
import { useSpanishWorkspace, SpanishNote } from '../components/learning/SpanishWorkspace';
import { ExternalLink, PageHeading } from '../components/learning/Workspace';
import { SPANISH_COURSES, SPANISH_RESEARCH_DATE, SPANISH_ROADMAP } from '../data/spanish';
import type { SpanishCourseStatus } from '../lib/spanish-hub';

const LEVELS = ['A1', 'A2', 'B1', 'B2'];

export function SpanishCourses() {
  const { state, save, busy } = useSpanishWorkspace();
  const [filter, setFilter] = useState('Todos');
  const primary = SPANISH_COURSES[0];

  const courses = SPANISH_COURSES.filter(course => {
    if (filter === 'Todos') return true;
    if (filter === 'Em andamento') return state.courses[course.id]?.status === 'in_progress';
    const [start, end = start] = course.level.split('–');
    return LEVELS.indexOf(filter) >= LEVELS.indexOf(start) && LEVELS.indexOf(filter) <= LEVELS.indexOf(end);
  });

  return <div className="learn-page">
    <PageHeading eyebrow={`ESPANHOL · ${SPANISH_COURSES.length} RECURSOS GRATUITOS`} title="Escolha sua próxima aula." text="Abra um curso, pratique e marque seu andamento. Tudo aqui é gratuito e aberto." />

    <div className="learn-banner">
      <span className="learn-task-symbol">01</span>
      <div>
        <strong>Comece pela aula 1 do Complete Spanish, do Language Transfer.</strong>
        <p>São 90 aulas em áudio que partem do português para construir o espanhol. Ouça, pause quando ele pedir e responda em voz alta antes da resposta aparecer.</p>
      </div>
      <ExternalLink href={primary.url} className="learn-button primary">Abrir curso principal</ExternalLink>
    </div>

    <details>
      <summary>Entender os níveis · A1 → B2</summary>
      <div className="learn-section-head"><div><span className="learn-eyebrow">UMA ROTA CLARA · A1 → B2</span><h2>O que muda em cada fase</h2></div><span className="learn-pill">{state.settings.level} agora</span></div>
      <div className="learn-roadmap">{SPANISH_ROADMAP.map((step, index) => <article className="learn-card" key={step.level}>
        <span className="learn-step-number">0{index + 1}</span>
        <small>{step.level}</small>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </article>)}</div>
    </details>

    <div className="learn-filter" role="group" aria-label="Filtrar cursos">{['Todos', ...LEVELS, 'Em andamento'].map(option => <button key={option} className={filter === option ? 'selected' : ''} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}</div>

    <div className="learn-course-grid">{courses.map(course => <article className="learn-card learn-course" key={course.id}>
      <div className={`learn-cover ${course.color}`}>
        <span>{course.skill}</span>
        <strong aria-hidden="true">{course.mark}</strong>
        <div><span>{course.level}</span><span>{course.type}</span></div>
      </div>
      <div className="learn-course-body">
        <span className="learn-eyebrow">{course.provider}</span>
        <h2>{course.title}</h2>
        <details>
          <summary>Sobre a aula e como estudar</summary>
          <p>{course.description}</p>
          <div className="learn-next"><strong>Sua tarefa</strong><p>{course.action}</p></div>
        </details>
        <ExternalLink href={course.url} className="learn-button primary">Abrir aula</ExternalLink>
        <label className="learn-course-status">Meu andamento
          <select aria-label={`Andamento: ${course.title}`} value={state.courses[course.id]?.status ?? 'not_started'} disabled={busy} onChange={e => {
            const status = e.target.value as SpanishCourseStatus;
            void save(s => { s.courses[course.id] = { note: s.courses[course.id]?.note ?? '', status }; });
          }}>
            <option value="not_started">Não iniciado</option>
            <option value="in_progress">Em andamento</option>
            <option value="completed">Finalizado</option>
          </select>
        </label>
        <details><summary>Anotar onde parei</summary><SpanishNote id={`curso-${course.id}`} /></details>
      </div>
    </article>)}</div>

    {!courses.length && <div className="learn-card">Nenhum curso neste filtro ainda. Marque “Em andamento” em um curso para encontrá-lo aqui.</div>}

    <details>
      <summary>Gratuidade e fontes</summary>
      <p className="learn-source">Links oficiais conferidos em {SPANISH_RESEARCH_DATE}. Todo o material indicado é gratuito; alguns sites pedem cadastro e oferecem planos pagos à parte, que não são necessários para o que está descrito aqui. Seu andamento é marcado por você e não é importado dos sites.</p>
    </details>
  </div>;
}
