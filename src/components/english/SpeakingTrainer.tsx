import { useState } from 'react';
import type { CEFRLevel } from '../../lib/english_types';
import type { VocabItem } from '../../data/english_vocab';
import { sampleSentences } from '../../lib/vocab_store';
import { speak, isTTSSupported, listenOnce, isSpeechRecognitionSupported, scoreSpeech, type SpeechScore } from '../../lib/speech';

export function SpeakingTrainer({
  userId: _userId, userLevel, onFinish,
}: { userId: string; userLevel: CEFRLevel | null; onFinish: (xp: number) => void }) {
  const [items] = useState<VocabItem[]>(() => sampleSentences(userLevel, 6));
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<SpeechScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const item = items[idx];

  if (!isSpeechRecognitionSupported()) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="text-5xl mb-4">🎤</div>
        <p className="mb-2 font-bold" style={{ color: 'var(--text-primary)' }}>Reconhecimento de voz indisponível</p>
        <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>Este recurso funciona no Google Chrome ou Microsoft Edge (no computador ou Android). Abra o app nesses navegadores para praticar pronúncia.</p>
        <button onClick={() => onFinish(0)} className="px-6 py-3 rounded-2xl font-bold" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}>Voltar</button>
      </div>
    );
  }

  if (done) {
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const xp = scores.reduce((a, b) => a + Math.round(b / 10), 0);
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="text-6xl mb-4">{avg >= 80 ? '🏆' : avg >= 50 ? '🗣️' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Pronúncia concluída!</h2>
        <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>Nota média de pronúncia: <strong style={{ color: 'var(--accent)' }}>{avg}%</strong></p>
        <p className="mb-6 font-bold" style={{ color: '#f9d423' }}>+{xp} XP 🔥</p>
        <button onClick={() => onFinish(xp)} className="px-6 py-3 rounded-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>Continuar</button>
      </div>
    );
  }

  async function record() {
    setError(null);
    setRecording(true);
    try {
      const r = await listenOnce();
      setResult(scoreSpeech(item.example, r.transcript));
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg === 'no-speech' ? 'Não ouvi nada — tente falar mais perto do microfone.' : 'Não consegui acessar o microfone. Verifique a permissão.');
    } finally {
      setRecording(false);
    }
  }

  function next() {
    setScores((s) => [...s, result?.score ?? 0]);
    setResult(null);
    setError(null);
    if (idx + 1 >= items.length) setDone(true);
    else setIdx(idx + 1);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onFinish(0)} className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>← Sair</button>
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{idx + 1} / {items.length}</span>
      </div>
      <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--bg-card)' }}>
        <div style={{ width: `${(idx / items.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width .3s' }} />
      </div>

      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Leia a frase em voz alta. Toque no microfone e fale com clareza.</p>

      {/* Sentence to read */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}>
        <div className="flex items-start gap-2">
          {isTTSSupported() && (
            <button onClick={() => speak(item.example)} title="Ouvir modelo" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: 6, color: 'var(--accent)', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            </button>
          )}
          <p className="text-lg font-semibold leading-snug">
            {result
              ? result.words.map((w, i) => (
                  <span key={i} style={{ color: w.ok ? 'var(--success)' : 'var(--danger)', textDecoration: w.ok ? 'none' : 'underline' }}>{w.word} </span>
                ))
              : <span style={{ color: 'var(--text-primary)' }}>{item.example}</span>}
          </p>
        </div>
        <p className="text-xs italic mt-2" style={{ color: 'var(--text-secondary)' }}>{item.example_pt}</p>
      </div>

      {result && (
        <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: result.score >= 70 ? 'rgba(16,240,160,0.08)' : 'rgba(249,212,35,0.08)', border: `1px solid ${result.score >= 70 ? 'rgba(16,240,160,0.3)' : 'rgba(249,212,35,0.3)'}` }}>
          <p className="text-3xl font-black mb-1" style={{ color: result.score >= 70 ? 'var(--success)' : 'var(--warning)' }}>{result.score}%</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Eu ouvi: "{result.transcript || '—'}"</p>
        </div>
      )}

      {error && <p className="text-sm text-center mb-4" style={{ color: 'var(--danger)' }}>{error}</p>}

      {!result ? (
        <button onClick={record} disabled={recording} className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2" style={{ background: recording ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', boxShadow: recording ? '0 0 24px rgba(255,77,109,0.5)' : '0 0 20px var(--accent-glow)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
          </svg>
          {recording ? 'Ouvindo… fale agora' : 'Falar'}
        </button>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => { setResult(null); setError(null); }} className="flex-1 py-3 rounded-2xl font-bold" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}>Tentar de novo</button>
          <button onClick={next} className="flex-1 py-3 rounded-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>{idx + 1 >= items.length ? 'Resultado' : 'Próxima →'}</button>
        </div>
      )}
    </div>
  );
}
