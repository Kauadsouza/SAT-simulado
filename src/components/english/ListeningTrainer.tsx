import { useState, useEffect } from 'react';
import type { CEFRLevel } from '../../lib/english_types';
import type { VocabItem } from '../../data/english_vocab';
import { sampleSentences } from '../../lib/vocab_store';
import { speak, isTTSSupported, scoreSpeech, type SpeechScore } from '../../lib/speech';

export function ListeningTrainer({
  userId: _userId, userLevel, onFinish,
}: { userId: string; userLevel: CEFRLevel | null; onFinish: (xp: number) => void }) {
  const [items] = useState<VocabItem[]>(() => sampleSentences(userLevel, 6));
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState<SpeechScore | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const item = items[idx];

  // Auto-play each new sentence.
  useEffect(() => {
    if (item && isTTSSupported()) speak(item.example);
  }, [idx, item]);

  if (!isTTSSupported()) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="text-5xl mb-4">🔇</div>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Seu navegador não suporta síntese de voz. Tente no Chrome ou Edge.</p>
        <button onClick={() => onFinish(0)} className="px-6 py-3 rounded-2xl font-bold" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}>Voltar</button>
      </div>
    );
  }

  if (done) {
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const xp = scores.reduce((a, b) => a + Math.round(b / 10), 0);
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="text-6xl mb-4">{avg >= 80 ? '🏆' : avg >= 50 ? '👂' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Ditado concluído!</h2>
        <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>Precisão média: <strong style={{ color: 'var(--accent)' }}>{avg}%</strong></p>
        <p className="mb-6 font-bold" style={{ color: '#f9d423' }}>+{xp} XP 🔥</p>
        <button onClick={() => onFinish(xp)} className="px-6 py-3 rounded-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>Continuar</button>
      </div>
    );
  }

  function check() {
    if (!typed.trim()) return;
    setResult(scoreSpeech(item.example, typed));
  }

  function next() {
    setScores((s) => [...s, result?.score ?? 0]);
    setResult(null);
    setTyped('');
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

      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Ouça a frase e escreva exatamente o que você ouviu.</p>

      <div className="flex justify-center mb-5">
        <button onClick={() => speak(item.example)} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--accent)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
          Ouvir de novo
        </button>
      </div>

      <textarea
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        disabled={!!result}
        rows={2}
        placeholder="Digite o que você ouviu…"
        className="w-full px-4 py-3 rounded-2xl mb-4 resize-none"
        style={{ background: 'var(--bg-card)', border: '2px solid var(--border-glow)', color: 'var(--text-primary)' }}
      />

      {result && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Frase correta</span>
            <span className="font-bold" style={{ color: result.score >= 70 ? 'var(--success)' : 'var(--warning)' }}>{result.score}%</span>
          </div>
          <p className="leading-relaxed mb-2">
            {result.words.map((w, i) => (
              <span key={i} style={{ color: w.ok ? 'var(--success)' : 'var(--danger)', fontWeight: w.ok ? 400 : 700, textDecoration: w.ok ? 'none' : 'underline' }}>{w.word} </span>
            ))}
          </p>
          <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>{item.example_pt}</p>
        </div>
      )}

      {!result ? (
        <button onClick={check} disabled={!typed.trim()} className="w-full py-3 rounded-2xl font-bold" style={{ background: typed.trim() ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg-card)', color: typed.trim() ? '#fff' : 'var(--text-secondary)', opacity: typed.trim() ? 1 : 0.6 }}>
          Verificar
        </button>
      ) : (
        <button onClick={next} className="w-full py-3 rounded-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>
          {idx + 1 >= items.length ? 'Ver resultado' : 'Próxima →'}
        </button>
      )}
    </div>
  );
}
