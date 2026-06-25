import { useState } from 'react';
import type { SrsCard, SrsGrade } from '../../lib/srs';
import { reviewSrsCard } from '../../lib/english_engine_storage';

const TYPE_LABELS: Record<SrsCard['type'], string> = { word: 'PALAVRA', chunk: 'CHUNK', sentence: 'FRASE' };

const GRADE_OPTIONS: [SrsGrade, string, string][] = [
  ['again', 'Errei', 'var(--danger)'],
  ['hard', 'Difícil', 'var(--warning)'],
  ['good', 'Bom', 'var(--success)'],
  ['easy', 'Fácil', 'var(--cyan)'],
];

export function SrsReviewTrainer({
  userId,
  cards,
  onFinish,
}: {
  userId: string;
  cards: SrsCard[];
  onFinish: () => void;
}) {
  const [queue, setQueue] = useState(cards);
  const [revealed, setRevealed] = useState(false);

  if (queue.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-3xl mb-3">✓</p>
        <p className="font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Tudo revisado por hoje!</p>
        <button
          onClick={onFinish}
          className="px-5 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Voltar ao plano
        </button>
      </div>
    );
  }

  const card = queue[0];

  async function grade(g: SrsGrade) {
    await reviewSrsCard(userId, card.id, g);
    setRevealed(false);
    setQueue((q) => q.slice(1));
  }

  return (
    <div className="max-w-md mx-auto">
      <p className="text-xs text-center mb-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {queue.length} card{queue.length > 1 ? 's' : ''} restante{queue.length > 1 ? 's' : ''}
      </p>
      <div
        className="rounded-2xl p-8 text-center mb-4 cursor-pointer select-none"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', minHeight: 170 }}
        onClick={() => setRevealed((r) => !r)}
      >
        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
          {TYPE_LABELS[card.type]} · {card.cefr}
        </span>
        <p className="text-xl font-bold mt-3" style={{ color: 'var(--text-primary)' }}>{card.front}</p>
        {revealed ? (
          <>
            <p className="text-lg mt-3 font-semibold" style={{ color: 'var(--accent)' }}>{card.back}</p>
            <p className="text-sm mt-2 italic" style={{ color: 'var(--text-secondary)' }}>{card.example}</p>
          </>
        ) : (
          <p className="text-xs mt-5" style={{ color: 'var(--text-secondary)' }}>toque para revelar</p>
        )}
      </div>

      {revealed ? (
        <div className="grid grid-cols-4 gap-2">
          {GRADE_OPTIONS.map(([g, label, color]) => (
            <button
              key={g}
              onClick={() => grade(g)}
              className="py-2.5 rounded-xl text-xs font-bold"
              style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`, color }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Mostrar resposta
        </button>
      )}
    </div>
  );
}
