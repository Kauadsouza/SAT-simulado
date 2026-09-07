import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PracticeLesson } from '../data/learning-hub';
import { practiceLessonsByVariant } from '../data/english-variants';
import { useLearningWorkspace, PageHeading, Note } from '../components/learning/Workspace';
import { SpeechPractice } from '../components/learning/SpeechPractice';
import { getDueSrsCards, mineVocabIntoSrs } from '../lib/english_engine_storage';
import { SrsReviewTrainer } from '../components/english/SrsReviewTrainer';
import type { SrsCard } from '../lib/srs';
import { ENGLISH_VARIANTS } from '../lib/learning-hub';

function Lesson({ lesson }: { lesson: PracticeLesson }) {
  const { state, save, userId, busy } = useLearningWorkspace();
  const variant = state.settings.variant;
  const variantMeta = ENGLISH_VARIANTS[variant];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('');
  return <article className="learn-card"><div className="learn-section-head"><div><span className="learn-eyebrow">PRÁTICA {variant === 'british' ? 'BRITÂNICA' : 'AMERICANA'} · {lesson.level}</span><h2>{lesson.title}</h2></div><span className="learn-pill">{state.checks[`lesson-${lesson.id}`]?.[0] ? 'Praticada ✓' : '8–15 min'}</span></div>
    <nav className="learn-stepper" aria-label="Passos da prática">{['Ouvir', 'Entender', 'Escrever'].map((label, index) => <button key={label} aria-current={step === index ? 'step' : undefined} onClick={() => setStep(index)}><span>{index + 1}</span>{label}</button>)}</nav>
    <section hidden={step !== 0}><h3>Ouça a situação</h3><p>Tente reconhecer o assunto e um detalhe.</p><SpeechPractice text={lesson.script} locale={variantMeta.locale} /><details className="learn-transcript"><summary>Mostrar texto e usar como leitura</summary><p lang={variantMeta.locale}>{lesson.script}</p></details>
    <button className="learn-button primary" onClick={() => setStep(1)}>Conferir o que entendi →</button></section>
    <section hidden={step !== 1}><h3>O que você entendeu?</h3><form className="learn-quiz" onSubmit={e => { e.preventDefault(); setChecked(true); }}>{lesson.questions.map((q, index) => <fieldset key={q.question}><legend lang="en">{index + 1}. {q.question}</legend>{q.options.map((option, optionIndex) => <label className="learn-choice" key={option}><input type="radio" name={`question-${index}`} required checked={answers[index] === optionIndex} disabled={checked} onChange={() => setAnswers(a => ({ ...a, [index]: optionIndex }))} /><span lang="en">{option}</span></label>)}{checked && <p className={answers[index] === q.answer ? 'learn-correct' : 'learn-feedback'}>{answers[index] === q.answer ? 'Isso mesmo. ' : `Reveja: ${q.options[q.answer]}. `}{q.why}</p>}</fieldset>)}<div className="learn-actions">{!checked ? <button className="learn-button primary">Conferir respostas</button> : <button type="button" className="learn-button" onClick={() => { setAnswers({}); setChecked(false); }}>Tentar novamente</button>}</div></form>
    <button className="learn-button primary" disabled={!checked} onClick={() => setStep(2)}>Agora é minha vez de escrever →</button>{!checked && <small className="learn-block">Confira as respostas para continuar.</small>}</section>
    <section hidden={step !== 2}><h3>Escreva do seu jeito</h3><p>{lesson.writing}</p><Note id={`writing-${lesson.id}`} title="Minha tentativa" placeholder="Escreva primeiro sem olhar o modelo. Não precisa sair perfeito…" /><details><summary>Ver um exemplo e como revisar</summary><p lang="en">{lesson.model}</p><p>Confira: respondi ao pedido? Minhas frases têm sujeito e verbo? A mensagem está clara? Reescreva uma frase para melhorar. Este modelo é um exemplo, não uma correção automática do seu texto.</p></details>
    <div className="learn-next"><strong lang={variantMeta.locale}>{lesson.phrase}</strong><p>{lesson.meaning}</p><button className="learn-button small" onClick={async () => { try { const n = await mineVocabIntoSrs(userId, [{ front: lesson.phrase, back: lesson.meaning, example: lesson.phrase, cefr: lesson.level, tags: ['english-hub', variant], type: 'sentence' }]); setMessage(n ? 'Frase adicionada à revisão.' : 'Esta frase já está no seu caderno de revisão.'); } catch { setMessage('Não foi possível guardar a frase. Tente novamente.'); } }}>Guardar frase para revisar</button><p role="status">{message}</p></div>
    <button className="learn-button primary" disabled={busy || !checked} onClick={() => save(s => { s.checks[`lesson-${lesson.id}`] = [true]; })}>Marcar esta prática como feita</button><small className="learn-block">Marque depois de ouvir ou ler, conferir e escrever. Isso registra prática, não domínio do nível.</small></section>
  </article>;
}

export function PracticePage() {
  const { state, userId } = useLearningWorkspace();
  const variant = state.settings.variant;
  const practiceLessons = practiceLessonsByVariant[variant];
  const [selected, setSelected] = useState(() => practiceLessons.find(l => l.level === state.settings.level)?.id ?? practiceLessons[0].id);
  const [cards, setCards] = useState<SrsCard[] | null>(null);
  const [notice, setNotice] = useState('');
  const [adding, setAdding] = useState(false);
  const lesson = practiceLessons.find(l => l.id === selected) ?? practiceLessons[0];
  return <div className="learn-page"><PageHeading eyebrow={`SEU LABORATÓRIO · INGLÊS ${variant === 'british' ? 'BRITÂNICO' : 'AMERICANO'}`} title="Aprenda fazendo." text="Escolha uma situação e siga os três passos." />
    <div className="learn-practice-layout"><aside className="learn-card learn-lesson-list"><span className="learn-eyebrow">ESCOLHA UMA PRÁTICA</span>{practiceLessons.map(l => <button key={l.id} className={l.id === selected ? 'selected' : ''} aria-pressed={l.id === selected} onClick={() => setSelected(l.id)}><span>{l.level}</span>{l.title}{state.checks[`lesson-${l.id}`]?.[0] && <span aria-label="Praticada">✓</span>}</button>)}<Link className="learn-button" to="/ingles">Mais lições e diagnóstico →</Link><small>O diagnóstico é uma estimativa de leitura e gramática. Não mede sozinho sua fala ou seu listening.</small></aside><Lesson key={lesson.id} lesson={lesson} /></div>
    <section className="learn-card" id="revisao"><span className="learn-eyebrow">REVISÃO ESPAÇADA</span><h2>Suas frases para revisar</h2><p>Tente lembrar antes de revelar a resposta. As frases voltam conforme a dificuldade que você informar.</p><button className="learn-button primary" onClick={async () => { try { setCards(await getDueSrsCards(userId)); setNotice(''); } catch { setNotice('Não foi possível abrir a revisão. Tente novamente.'); } }}>Abrir revisão de hoje</button>{cards && (cards.length ? <SrsReviewTrainer key={cards.map(c => c.id).join('-')} userId={userId} cards={cards} onFinish={() => setCards(null)} /> : <p>Nenhuma frase pendente agora. Você pode guardar uma expressão das práticas acima.</p>)}
    <details><summary>Guardar uma correção ou expressão minha</summary><form className="learn-note" data-private onSubmit={async e => { e.preventDefault(); const form = e.currentTarget; const data = new FormData(form); setAdding(true); try { const front = String(data.get('front')).trim(); const back = String(data.get('back')).trim(); if (!front || !back) { setNotice('Preencha a expressão e o significado.'); return; } const n = await mineVocabIntoSrs(userId, [{ front, back, example: String(data.get('example')).trim() || front, cefr: state.settings.level, tags: ['my-corrections'], type: 'sentence' }]); setNotice(n ? 'Expressão guardada para revisar.' : 'Esta expressão já está na revisão.'); form.reset(); } catch { setNotice('Não foi possível salvar. Seu texto continua no formulário.'); } finally { setAdding(false); } }}><label>Expressão correta em inglês<input name="front" required maxLength={250} placeholder="I agree with you." /></label><label>Significado ou explicação<input name="back" required maxLength={500} placeholder="Eu concordo com você. Sem am antes de agree." /></label><label>Exemplo de uso<input name="example" maxLength={500} placeholder="I agree with you about the video." /></label><button className="learn-button" disabled={adding}>Adicionar à revisão</button></form></details><p role="status">{notice}</p></section>
  </div>;
}
