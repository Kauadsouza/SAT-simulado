import { useCallback, useEffect, useState } from 'react';
import type { CEFRLevel } from '../../lib/english_types';
import { generateReadingContent, type ReadingContent } from '../../lib/llm_reading';
import { getCachedContent, setCachedContent } from '../../lib/llm_content_storage';
import { mineVocabIntoSrs } from '../../lib/english_engine_storage';
import type { EnglishVariant } from '../../lib/learning-hub';

type Phase = 'loading' | 'error' | 'passage' | 'questions' | 'summary';

export function ReadingTrainer({
  userId,
  date,
  cefr,
  variant,
  onComplete,
}: {
  userId: string;
  date: string;
  cefr: CEFRLevel;
  variant: EnglishVariant;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [content, setContent] = useState<ReadingContent | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [minedCount, setMinedCount] = useState<number | null>(null);

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      const cacheKey = `reading-${variant}`;
      const cached = await getCachedContent<ReadingContent>(userId, date, cacheKey);
      if (cached) {
        setContent(cached);
        setPhase('passage');
        return;
      }
      const generated = await generateReadingContent(cefr, variant);
      await setCachedContent(userId, date, cacheKey, cefr, generated);
      setContent(generated);
      setPhase('passage');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Erro desconhecido ao gerar conteúdo.');
      setPhase('error');
    }
  }, [userId, date, cefr, variant]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="animate-spin" style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Gerando passagem de leitura no seu nível ({cefr})...</p>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--danger)' }}>Não foi possível gerar o conteúdo</p>
        <p className="text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>{errorMsg}</p>
        <button onClick={load} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{ background: 'var(--accent)', color: '#fff' }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!content) return null;

  if (phase === 'passage') {
    return (
      <div>
        <span
          className="inline-block mb-3 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          {cefr}
        </span>
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', lineHeight: 1.7, color: 'var(--text-primary)', fontSize: '0.95rem' }}
        >
          {content.passage}
        </div>
        <button
          onClick={() => setPhase('questions')}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Continuar para as perguntas →
        </button>
      </div>
    );
  }

  if (phase === 'questions') {
    const q = content.questions[qIdx];
    const isLast = qIdx === content.questions.length - 1;

    async function handleSelect(i: number) {
      if (selected !== null) return;
      setSelected(i);
      if (i === q.correctIndex) setCorrectCount((c) => c + 1);
    }

    async function handleNext() {
      if (isLast) {
        const mined = await mineVocabIntoSrs(
          userId,
          content!.vocab.map((v) => ({ front: v.word, back: v.translation, example: v.example, cefr, tags: ['reading', 'gerado', variant] })),
        );
        setMinedCount(mined);
        setPhase('summary');
      } else {
        setQIdx((i) => i + 1);
        setSelected(null);
      }
    }

    return (
      <div>
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
          Pergunta {qIdx + 1} de {content.questions.length}
        </p>
        <p className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{q.prompt}</p>
        <div className="flex flex-col gap-2 mb-4">
          {q.choices.map((choice, i) => {
            const isCorrect = i === q.correctIndex;
            const isChosen = i === selected;
            let bg = 'var(--bg-card)';
            let border = 'var(--border-glow)';
            let color = 'var(--text-primary)';
            if (selected !== null) {
              if (isCorrect) { bg = 'rgba(16,240,160,0.1)'; border = 'rgba(16,240,160,0.4)'; color = 'var(--success)'; }
              else if (isChosen) { bg = 'rgba(255,77,109,0.1)'; border = 'rgba(255,77,109,0.4)'; color = 'var(--danger)'; }
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: bg, border: `1px solid ${border}`, color }}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <>
            <div
              className="rounded-xl p-3 mb-4 text-xs"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', lineHeight: 1.6 }}
            >
              {q.explanation}
            </div>
            <button onClick={handleNext} className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: 'var(--accent)', color: '#fff' }}>
              {isLast ? 'Ver resultado →' : 'Próxima pergunta →'}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-3xl mb-3">✓</p>
      <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {correctCount} de {content.questions.length} corretas
      </p>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        {minedCount} palavra{minedCount === 1 ? '' : 's'} nova{minedCount === 1 ? '' : 's'} adicionada{minedCount === 1 ? '' : 's'} ao seu baralho de SRS.
      </p>
      <button onClick={onComplete} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{ background: 'var(--accent)', color: '#fff' }}>
        Concluir
      </button>
    </div>
  );
}
