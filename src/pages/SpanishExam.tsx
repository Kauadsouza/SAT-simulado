import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpanishWorkspace, SpanishNote } from '../components/learning/SpanishWorkspace';
import { PageHeading } from '../components/learning/Workspace';
import { localDate } from '../lib/learning-hub';
import { SKILL_LABEL, SPANISH_QUESTIONS, type SpanishQuestion, type SpanishSkill } from '../data/spanish';

type Focus = 'todas' | SpanishSkill;

function pick(questions: SpanishQuestion[], total: number): SpanishQuestion[] {
  const pool = [...questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, total);
}

export function SpanishExam() {
  const { state, save, busy } = useSpanishWorkspace();
  const [focus, setFocus] = useState<Focus>('todas');
  const [size, setSize] = useState(6);
  const [questions, setQuestions] = useState<SpanishQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
  const [saveError, setSaveError] = useState('');

  const available = useMemo(() => focus === 'todas' ? SPANISH_QUESTIONS : SPANISH_QUESTIONS.filter(q => q.skill === focus), [focus]);
  const attempts = [...state.attempts].reverse().slice(0, 5);

  function start() {
    setQuestions(pick(available, Math.min(size, available.length)));
    setAnswers({});
    setResult(null);
    setSaveError('');
  }

  async function finish() {
    if (!questions) return;
    const correct = questions.filter(q => answers[q.id] === q.answer).length;
    setResult({ correct, total: questions.length });
    const ok = await save(s => { s.attempts = [...s.attempts, { date: localDate(), correct, total: questions.length }]; });
    if (!ok) setSaveError('A pontuação apareceu aqui, mas não foi salva no seu caderno. Tente novamente mais tarde.');
  }

  return <div className="learn-page">
    <PageHeading eyebrow="SIMULADO AUTORAL · ESPANHOL" title="Teste o que você já entende." text="Questões de interpretação, vocabulário em contexto, gramática em uso e falsos amigos. É prática autoral: não reproduz nem substitui nenhuma prova oficial." />

    {!questions && <section className="learn-card">
      <div className="learn-section-head"><div><span className="learn-eyebrow">MONTE SEU TESTE</span><h2>Como você quer praticar hoje?</h2></div><span className="learn-pill">{available.length} questões disponíveis</span></div>
      <div className="learn-filter" role="group" aria-label="Foco do simulado">
        {(['todas', 'interpretacao', 'vocabulario', 'gramatica', 'falsos_amigos'] as Focus[]).map(key => <button key={key} className={focus === key ? 'selected' : ''} aria-pressed={focus === key} onClick={() => setFocus(key)}>{key === 'todas' ? 'Todas as áreas' : SKILL_LABEL[key]}</button>)}
      </div>
      <div className="learn-between">
        <label>Quantidade de questões<select value={size} onChange={e => setSize(Number(e.target.value))}>{[4, 6, 10, 12].map(n => <option key={n} value={n}>{n} questões</option>)}</select></label>
        <button className="learn-button primary" onClick={start} disabled={!available.length}>Começar simulado →</button>
      </div>
      <small>Sem cronômetro. A ideia é entender por que a resposta certa é certa, não correr contra o tempo.</small>
    </section>}

    {questions && <form className="learn-card learn-quiz" onSubmit={e => { e.preventDefault(); void finish(); }}>
      <div className="learn-section-head"><div><span className="learn-eyebrow">{result ? 'RESULTADO' : 'EM ANDAMENTO'}</span><h2>{result ? `Você acertou ${result.correct} de ${result.total}` : `${questions.length} questões`}</h2></div>{!result && <span className="learn-pill">{Object.keys(answers).length} / {questions.length} respondidas</span>}</div>

      {questions.map((question, index) => {
        const chosen = answers[question.id];
        const right = chosen === question.answer;
        return <fieldset key={question.id}>
          <legend>{index + 1}. {SKILL_LABEL[question.skill]} · {question.level}</legend>
          {question.passage && <blockquote lang="es">{question.passage}{question.passageNote && <cite>{question.passageNote}</cite>}</blockquote>}
          <p>{question.prompt}</p>
          {question.choices.map((choice, choiceIndex) => <label className="learn-choice" key={choice}>
            <input type="radio" name={question.id} required disabled={Boolean(result)} checked={chosen === choiceIndex} onChange={() => setAnswers(current => ({ ...current, [question.id]: choiceIndex }))} />
            <span>{choice}</span>
          </label>)}
          {result && <p className={right ? 'learn-correct' : 'learn-feedback'}>{right ? 'Correto. ' : `Resposta: ${question.choices[question.answer]}. `}{question.why}</p>}
        </fieldset>;
      })}

      {saveError && <p role="alert" className="learn-feedback">{saveError}</p>}
      <div className="learn-actions">
        {result
          ? <><button className="learn-button primary" type="button" onClick={start}>Fazer outro simulado</button><button className="learn-button" type="button" onClick={() => { setQuestions(null); setResult(null); }}>Mudar o foco</button><Link className="learn-button" to="/espanhol/praticar">Revisar as frases</Link></>
          : <><button className="learn-button primary" disabled={busy}>Conferir respostas</button><button className="learn-button" type="button" onClick={() => { setQuestions(null); setAnswers({}); }}>Cancelar</button></>}
      </div>
    </form>}

    {attempts.length > 0 && <section className="learn-card">
      <div className="learn-section-head"><div><span className="learn-eyebrow">SEU HISTÓRICO</span><h2>Últimas tentativas</h2></div></div>
      <div className="learn-table-wrap"><table className="learn-table">
        <thead><tr><th>Data</th><th>Acertos</th><th>Aproveitamento</th></tr></thead>
        <tbody>{attempts.map((attempt, index) => <tr key={`${attempt.date}-${index}`}>
          <th scope="row">{new Date(attempt.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</th>
          <td>{attempt.correct} de {attempt.total}</td>
          <td>{Math.round((attempt.correct / attempt.total) * 100)}%</td>
        </tr>)}</tbody>
      </table></div>
      <small>Guardado no seu caderno, junto com o restante do seu progresso.</small>
    </section>}

    <details className="learn-card"><summary>Meu caderno do simulado</summary><SpanishNote id="simulado" title="O que errei e por quê" placeholder="Questão · por que errei · a regra ou palavra que faltou · quando revisar…" /></details>
  </div>;
}
