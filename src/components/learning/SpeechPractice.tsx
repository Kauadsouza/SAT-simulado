import { useEffect, useRef, useState } from 'react';

export function SpeechPractice({ text, locale = 'en-GB' }: { text: string; locale?: 'en-GB' | 'en-US' }) {
  const [speaking, setSpeaking] = useState(false);
  const [slow, setSlow] = useState(true);
  const [message, setMessage] = useState('');
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, [text, locale]);
  function listen() {
    if (!('speechSynthesis' in window)) { setMessage('Este navegador não oferece leitura em voz alta. Use o texto ou um áudio dos cursos.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const target = locale.toLowerCase();
    utterance.voice = voices.find(v => v.lang.toLowerCase() === target && v.localService) ?? voices.find(v => v.lang.toLowerCase() === target) ?? voices.find(v => v.lang.toLowerCase().startsWith('en') && v.localService) ?? voices.find(v => v.lang.toLowerCase().startsWith('en')) ?? null;
    utterance.lang = locale; utterance.rate = slow ? 0.8 : 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = event => { setSpeaking(false); if (!['canceled', 'interrupted'].includes(event.error)) setMessage('O áudio não iniciou. Verifique as vozes em inglês do dispositivo ou use os áudios dos cursos.'); };
    setMessage(''); setSpeaking(true); window.speechSynthesis.speak(utterance);
  }
  return <div className="learn-speech"><div className="learn-actions"><button className="learn-button primary" onClick={listen}>▶ {speaking ? 'Ouvir novamente' : `Ouvir em inglês ${locale === 'en-GB' ? 'britânico' : 'americano'}`}</button>{speaking && <button className="learn-button" onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); }}>Parar áudio</button>}<label className="learn-check-label"><input type="checkbox" checked={slow} onChange={e => setSlow(e.target.checked)} /> Mais devagar</label></div><small>Voz {locale} sintetizada pelo navegador. Se o dispositivo não tiver essa voz, ele usará outra voz em inglês; combine com os áudios naturais dos cursos.</small>{message && <p role="status">{message}</p>}</div>;
}

export function VoiceRecorder() {
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const objectUrl = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const mounted = useRef(true);
  const requesting = useRef(false);
  useEffect(() => { mounted.current = true; return () => {
    mounted.current = false;
    if (timer.current) clearTimeout(timer.current);
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach(t => t.stop());
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }; }, []);
  function stop() { if (timer.current) clearTimeout(timer.current); if (recorder.current?.state === 'recording') recorder.current.stop(); }
  async function start() {
    if (requesting.current || recorder.current?.state === 'recording') return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setError('Gravação indisponível neste navegador. Você pode praticar no modo voz do ChatGPT.'); return; }
    requesting.current = true; setError('');
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { media.getTracks().forEach(t => t.stop()); return; }
      stream.current = media;
      const instance = new MediaRecorder(media); recorder.current = instance;
      const chunks: BlobPart[] = [];
      instance.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      instance.onerror = () => { stop(); media.getTracks().forEach(t => t.stop()); if (mounted.current) { setRecording(false); setError('A gravação foi interrompida. Tente novamente.'); } };
      instance.onstop = () => {
        media.getTracks().forEach(t => t.stop());
        if (!mounted.current) return;
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = URL.createObjectURL(new Blob(chunks, { type: instance.mimeType }));
        setUrl(objectUrl.current); setRecording(false);
      };
      instance.start(); setRecording(true); timer.current = setTimeout(stop, 120_000);
    } catch { stream.current?.getTracks().forEach(t => t.stop()); if (mounted.current) setError('O microfone não foi liberado. Se estiver dentro do Hub, abra esta prática em uma janela própria e tente novamente.'); }
    finally { requesting.current = false; }
  }
  return <section className="learn-recorder"><h3>Ouça a sua própria tentativa</h3><p>Grave até 2 minutos, ouça e tente novamente. O áudio fica temporariamente nesta página e não é enviado ao servidor. Não há nota automática de pronúncia.</p><div className="learn-actions"><button className={`learn-button ${recording ? 'recording' : ''}`} onClick={recording ? stop : start}>{recording ? '■ Parar gravação' : '● Gravar minha tentativa'}</button><a className="learn-text-link" href="https://sat-simulado.vercel.app/conversacao" target="_blank" rel="noopener noreferrer">Abrir fora do Hub ↗</a></div>{recording && <p role="status">Gravando… para automaticamente em 2 minutos.</p>}{error && <p role="alert">{error}</p>}{url && <div><audio controls src={url} /><a href={url} download="minha-pratica-de-ingles">Baixar minha gravação</a></div>}</section>;
}
