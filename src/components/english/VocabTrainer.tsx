import { useState, useEffect } from 'react';
import type { CEFRLevel } from '../../lib/english_types';
import type { VocabItem } from '../../data/english_vocab';
import type { ReviewGrade } from '../../lib/srs';
import { buildVocabSession, recordVocabReview } from '../../lib/vocab_store';
import { speak, isTTSSupported } from '../../lib/speech';

function SpeakerBtn({ text, size = 18 }: { text: string; size?: number }) {
  if (!isTTSSupported()) return null;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      title="Ouvir"
      style={{
        background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 10, padding: 6, color: 'var(--accent)', display: 'inline-flex', flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </svg>
    </button>
  );
}

const RATINGS: { grade: ReviewGrade; label: string; color: string }[] = [
  { grade: 'again', label: 'Errei', color: 'var(--danger)' },
  { grade: 'hard', label: 'Difícil', color: 'var(--warning)' },
  { grade: 'good', label: 'Bom', color: 'var(--accent)' },
  { grade: 'easy', label: 'Fácil', color: 'var(--success)' },
];

export function VocabTrainer({
  userId, userLevel, onFinish,
}: { userId: string; userLevel: CEFRLevel | null; onFinish: (xp: number) => void }) {
  const [items, setItems] = useState<VocabItem[] | null>(null);
  const [meta, setMeta] = useState({ dueCount: 0, newCount: 0 });
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    buildVocabSession(userId, userLevel).then((s) => {
      setItems(s.items);
      setMeta({ dueCount: s.dueCount, newCount: s.newCount });
    });
  }, [userId, userLevel]);

  if (!items) {
    return <div className="max-w-md mx-auto px-4 py-10 text-center" style={{ color: 'var(--text-secondary)' }}>Carregando…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Nenhuma palavra pendente agora. Volte mais tarde para revisar!</p>
        <button onClick={() => onFinish(0)} className="px-6 py-3 rounded-2xl font-bold" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}>Voltar</button>
      </div>
    );
  }

  if (done) {
    const xp = items.length * 8;
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="text-6xl mb-4">{known >= items.length * 0.8 ? '🏆' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Sessão concluída!</h2>
        <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>Você revisou <strong style={{ color: 'var(--accent)' }}>{items.length}</strong> palavras.</p>
        <p className="mb-6 font-bold" style={{ color: '#f9d423' }}>+{xp} XP 🔥</p>
        <button onClick={() => onFinish(xp)} className="px-6 py-3 rounded-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>Continuar</button>
      </div>
    );
  }

  const item = items[idx];

  async function rate(grade: ReviewGrade) {
    await recordVocabReview(userId, item, grade);
    if (grade !== 'again') setKnown((k) => k + 1);
    if (idx + 1 >= items!.length) setDone(true);
    else { setIdx(idx + 1); setRevealed(false); }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onFinish(idx * 8)} className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>← Sair</button>
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{idx + 1} / {items.length} · 🔁 {meta.dueCount} revisão · ✨ {meta.newCount} novas</span>
      </div>
      <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--bg-card)' }}>
        <div style={{ width: `${(idx / items.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width .3s' }} />
      </div>

      {/* Card */}
      <div className="rounded-3xl p-8 mb-5 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', minHeight: 220, boxShadow: '0 16px 50px rgba(0,0,0,0.3)' }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.word}</span>
          <SpeakerBtn text={item.word} size={22} />
        </div>
        <p className="text-xs italic mb-4" style={{ color: 'var(--text-secondary)' }}>{item.pos} · {item.level}</p>

        {!revealed ? (
          <button onClick={() => { setRevealed(true); }} className="px-5 py-2.5 rounded-2xl font-bold text-sm" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--accent)' }}>
            Mostrar significado
          </button>
        ) : (
          <div>
            <p className="text-xl font-bold mb-4" style={{ color: 'var(--success)' }}>{item.translation}</p>
            <div className="rounded-2xl p-3 text-left" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-2 mb-1">
                <SpeakerBtn text={item.example} />
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.example}</p>
              </div>
              <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>{item.example_pt}</p>
            </div>
          </div>
        )}
      </div>

      {revealed && (
        <div>
          <p className="text-xs text-center mb-2" style={{ color: 'var(--text-secondary)' }}>Você lembrava dessa palavra?</p>
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <button key={r.grade} onClick={() => rate(r.grade)} className="py-3 rounded-2xl font-bold text-sm" style={{ background: 'var(--bg-card)', border: `1px solid ${r.color}`, color: r.color }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
