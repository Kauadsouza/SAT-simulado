import { useState } from 'react';
import { speakingTopics } from '../data/learning-hub';
import { conversationPrompt } from '../lib/learning-hub';
import { useLearningWorkspace, Note, PageHeading, ExternalLink } from '../components/learning/Workspace';
import { SpeechPractice, VoiceRecorder } from '../components/learning/SpeechPractice';

export function ConversationPage() {
  const { state } = useLearningWorkspace();
  const [topicIndex, setTopicIndex] = useState(0);
  const [duration, setDuration] = useState(10);
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState('');
  const topic = speakingTopics[topicIndex];
  const prompt = customPrompt ?? conversationPrompt(state.settings.level, topic.task, duration);
  return <div className="learn-page"><PageHeading eyebrow="CONVERSAÇÃO · OUÇA, FALE, TENTE DE NOVO" title="Seu inglês merece sair do papel." text="Comece com uma situação pequena. Aqui você prepara a conversa, pratica uma frase e leva um tutor contextualizado para o modo voz do ChatGPT." />
    <div className="learn-topic-grid" role="group" aria-label="Tema da conversa">{speakingTopics.map((item, index) => <button key={item.title} aria-pressed={index === topicIndex} className={index === topicIndex ? 'selected' : ''} onClick={() => { setTopicIndex(index); setCustomPrompt(null); setCopied(''); }}><span aria-hidden="true">{item.icon}</span><strong>{item.title}</strong></button>)}</div>
    <div className="learn-columns"><section className="learn-card"><span className="learn-eyebrow">01 · AQUEÇA A VOZ</span><h2>{topic.title}</h2><p>{topic.task}.</p><blockquote lang="en">{topic.starter}</blockquote><SpeechPractice key={topic.title} text={topic.starter} /><div className="learn-next"><strong>Ouça → repita → mude uma parte</strong><p>Repita a frase e depois troque uma palavra para falar de você. Se travar, diga “Could you say that again?”</p></div><VoiceRecorder /></section>
    <section className="learn-card"><span className="learn-eyebrow">02 · UMA CONVERSA DE VERDADE</span><h2>Seu parceiro no ChatGPT</h2><ol className="learn-instructions"><li>Copie o contexto abaixo e cole em uma conversa no ChatGPT.</li><li>Envie o texto. Depois toque no ícone de voz e permita o microfone quando o ChatGPT solicitar.</li><li>Converse no seu ritmo. Ao terminar, peça “resumo” e guarde as correções aqui.</li></ol><div className="learn-between"><label>Duração sugerida<select value={duration} onChange={e => { setDuration(Number(e.target.value)); setCustomPrompt(null); setCopied(''); }}>{[5, 10, 15, 20].map(n => <option value={n} key={n}>{n} minutos</option>)}</select></label><span className="learn-pill">Prática {state.settings.level}</span></div>
      <label className="learn-prompt-label" htmlFor="voice-prompt">Contexto pronto para copiar (você pode editar)</label><textarea id="voice-prompt" data-private className="learn-prompt" rows={12} maxLength={8000} value={prompt} onChange={e => { setCustomPrompt(e.target.value); setCopied(''); }} />
      <div className="learn-actions"><button className="learn-button primary" onClick={async () => { try { await navigator.clipboard.writeText(prompt); setCopied('Contexto copiado. Agora cole no ChatGPT.'); } catch { setCopied('Selecione o texto acima e copie com Ctrl+C ou pelo menu do celular.'); } }}>Copiar contexto</button><ExternalLink href="https://chatgpt.com/">Abrir ChatGPT</ExternalLink></div><p role="status">{copied}</p><small>Você escolhe quando enviar o contexto. Voz e limites dependem da sua conta; também é possível conversar por texto. O áudio gravado aqui não é enviado ao ChatGPT.</small><ExternalLink className="learn-text-link" href="https://help.openai.com/en/articles/8400625-voice-mode-faq">Como funciona o modo voz</ExternalLink>
    </section></div>
    <section className="learn-card"><Note id="conversation-notes" title="03 · O que levo desta conversa" placeholder="Data e tema · uma coisa que consegui dizer · minha frase → correção · o que vou tentar amanhã…" /></section>
  </div>;
}
