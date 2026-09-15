import { useState } from 'react';
import { useSpanishWorkspace, SpanishNote } from '../components/learning/SpanishWorkspace';
import { SpeechPractice, VoiceRecorder } from '../components/learning/SpeechPractice';
import { ExternalLink, PageHeading } from '../components/learning/Workspace';
import { conversationPromptEs, SPANISH_VARIANTS } from '../lib/spanish-hub';
import { SPANISH_TOPICS } from '../data/spanish';

export function SpanishConversation() {
  const { state } = useSpanishWorkspace();
  const [topicIndex, setTopicIndex] = useState(0);
  const [duration, setDuration] = useState(10);
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState('');
  const variant = state.settings.variant;
  const variantMeta = SPANISH_VARIANTS[variant];
  const topic = SPANISH_TOPICS[topicIndex];
  const prompt = customPrompt ?? conversationPromptEs(state.settings.level, topic.task, duration, variant);

  return <div className="learn-page">
    <PageHeading eyebrow={`CONVERSAÇÃO · ${variantMeta.shortLabel.toUpperCase()}`} title="¿Hablamos?" text="Escolha uma situação. Ouça, repita e depois leve para uma conversa de verdade." />

    <div className="learn-topic-grid" role="group" aria-label="Situação da conversa">{SPANISH_TOPICS.map((item, index) => <button key={item.title} aria-pressed={index === topicIndex} className={index === topicIndex ? 'selected' : ''} onClick={() => { setTopicIndex(index); setCustomPrompt(null); setCopied(''); }}><span aria-hidden="true">{item.icon}</span><strong>{item.title}</strong></button>)}</div>

    <div className="learn-columns">
      <section className="learn-card">
        <span className="learn-eyebrow">01 · AQUEÇA A VOZ</span>
        <h2>{topic.title}</h2>
        <p>Objetivo: {topic.task}.</p>
        <blockquote lang="es">{topic.starter}</blockquote>
        <SpeechPractice key={`${variant}-${topic.title}`} text={topic.starter} locale={variantMeta.locale} />
        <div className="learn-next"><strong>Ouça → repita → troque uma parte</strong><p>Repita a frase e depois mude uma palavra para falar de você. Se travar, diga “¿Puedes repetirlo, por favor?”.</p></div>
        <VoiceRecorder />
      </section>

      <section className="learn-card">
        <span className="learn-eyebrow">02 · UMA CONVERSA DE VERDADE</span>
        <h2>Seu parceiro no ChatGPT</h2>
        <ol className="learn-instructions">
          <li><strong>Copie</strong> o contexto do tutor.</li>
          <li><strong>Cole e envie</strong> no ChatGPT. Ative a voz se quiser.</li>
          <li><strong>Converse.</strong> Ao terminar, peça “resumen”.</li>
        </ol>
        <div className="learn-between">
          <label>Duração sugerida<select value={duration} onChange={e => { setDuration(Number(e.target.value)); setCustomPrompt(null); setCopied(''); }}>{[5, 10, 15, 20].map(n => <option value={n} key={n}>{n} minutos</option>)}</select></label>
          <span className="learn-pill">Prática {state.settings.level}</span>
        </div>
        <details>
          <summary>Ver ou editar o contexto do tutor</summary>
          <label className="learn-prompt-label" htmlFor="prompt-es">Contexto pronto para copiar (você pode editar)</label>
          <textarea id="prompt-es" data-private className="learn-prompt" rows={12} maxLength={8000} value={prompt} onChange={e => { setCustomPrompt(e.target.value); setCopied(''); }} />
        </details>
        <div className="learn-actions">
          <button className="learn-button primary" onClick={async () => { try { await navigator.clipboard.writeText(prompt); setCopied('Contexto copiado. Agora cole no ChatGPT.'); } catch { setCopied('Abra “Ver ou editar o contexto do tutor”, selecione o texto e copie com Ctrl+C ou pelo menu do celular.'); } }}>Copiar contexto</button>
          <ExternalLink href="https://chatgpt.com/">Abrir ChatGPT</ExternalLink>
        </div>
        <p role="status">{copied}</p>
        <small>O contexto pede que o tutor corrija portunhol e falsos amigos. O áudio gravado aqui não é enviado ao ChatGPT.</small>
      </section>
    </div>

    <section className="learn-card"><SpanishNote id={`conversacion-${variant}`} title="03 · O que levo desta conversa" placeholder="Data e situação · uma coisa que consegui dizer · minha frase → correção · o que tento amanhã…" /></section>
  </div>;
}
