import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpanishWorkspace, SpanishNote } from '../components/learning/SpanishWorkspace';
import { SpeechPractice, VoiceRecorder } from '../components/learning/SpeechPractice';
import { SPANISH_VARIANTS } from '../lib/spanish-hub';
import { FALSE_FRIENDS, SPANISH_UNITS } from '../data/spanish';
import { PageHeading } from '../components/learning/Workspace';

function FalseFriendTrainer({ locale }: { locale: string }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seen, setSeen] = useState<string[]>([]);
  const card = FALSE_FRIENDS[index];
  function next() {
    setSeen(current => current.includes(card.es) ? current : [...current, card.es]);
    setRevealed(false);
    setIndex(current => (current + 1) % FALSE_FRIENDS.length);
  }
  return <section className="learn-card">
    <div className="learn-section-head"><div><span className="learn-eyebrow">O ERRO MAIS CARO · FALSOS AMIGOS</span><h2>Parece português, mas não é</h2></div><span className="learn-pill">{seen.length} / {FALSE_FRIENDS.length} vistos</span></div>
    <p>Leia a palavra e tente lembrar o significado real antes de revelar.</p>
    <div className="learn-next">
      <strong lang="es">{card.es}</strong>
      <p>Um brasileiro leria como: <em>{card.looksLike}</em></p>
      {revealed ? <>
        <p className="learn-correct">Significa: <strong>{card.realMeaning}</strong></p>
        <blockquote lang="es">{card.example}</blockquote>
        <SpeechPractice key={card.es} text={card.example} locale={locale} />
      </> : <p className="learn-muted">O significado aparece quando você revelar.</p>}
    </div>
    <div className="learn-actions">
      {revealed ? <button className="learn-button primary" onClick={next}>Próxima palavra →</button> : <button className="learn-button primary" onClick={() => setRevealed(true)}>Revelar significado</button>}
      <button className="learn-button" onClick={() => { setIndex(0); setRevealed(false); setSeen([]); }}>Recomeçar</button>
    </div>
  </section>;
}

export function SpanishPractice() {
  const { state } = useSpanishWorkspace();
  const variantMeta = SPANISH_VARIANTS[state.settings.variant];
  const units = SPANISH_UNITS.filter(unit => unit.level === state.settings.level);
  const fallback = SPANISH_UNITS.filter(unit => unit.level === 'A1');
  const active = units.length ? units : fallback;

  return <div className="learn-page">
    <PageHeading eyebrow={`PRÁTICA · ${variantMeta.shortLabel.toUpperCase()} · ${state.settings.level}`} title="Praticar espanhol de verdade" text="Ouça, repita e escreva suas próprias frases. O objetivo não é decorar listas, é conseguir usar." />

    <section className="learn-card" id="escutar">
      <div className="learn-section-head"><div><span className="learn-eyebrow">01 · ESCUTAR E REPETIR</span><h2>Frases do seu nível</h2></div></div>
      {active.map(unit => <article key={unit.title} className="learn-next">
        <strong>{unit.title}</strong>
        <p className="learn-muted">{unit.focus}</p>
        {unit.phrases.map(phrase => <div key={phrase.es} className="learn-phrase">
          <p lang="es"><strong>{phrase.es}</strong></p>
          <p className="learn-muted">{phrase.pt}</p>
          <SpeechPractice key={`${phrase.es}-${variantMeta.locale}`} text={phrase.es} locale={variantMeta.locale} />
        </div>)}
        <p className="learn-correct">{unit.point}</p>
      </article>)}
      {!units.length && <p className="learn-muted">Ainda não há um bloco específico para {state.settings.level}. Estas são as frases-base do A1 — mude o nível no seu plano quando quiser.</p>}
    </section>

    <FalseFriendTrainer locale={variantMeta.locale} />

    <section className="learn-card">
      <div className="learn-section-head"><div><span className="learn-eyebrow">02 · USAR O QUE APRENDEU</span><h2>Escreva três frases suas</h2></div></div>
      <p>Pegue uma frase acima e adapte para a sua vida: seu nome, sua cidade, sua rotina. Errar aqui é barato.</p>
      <SpanishNote id={`practica-${state.settings.level}`} title="Minhas frases de hoje" placeholder="Me llamo… / Vivo en… / Hoy quiero…" />
      <VoiceRecorder />
    </section>

    <section className="learn-card" id="revisar">
      <div className="learn-section-head"><div><span className="learn-eyebrow">03 · LEMBRAR SEM OLHAR</span><h2>Revisão do dia anterior</h2></div></div>
      <p>Abra o seu caderno, leia só a tradução em português e tente reconstruir a frase em espanhol antes de conferir.</p>
      <div className="learn-actions">
        <Link className="learn-button primary" to="/espanhol/simulado">Testar com o simulado →</Link>
        <Link className="learn-button" to="/espanhol/conversacao">Levar para uma conversa</Link>
      </div>
    </section>
  </div>;
}
