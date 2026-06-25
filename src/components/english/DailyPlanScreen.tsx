import { useCallback, useEffect, useState } from 'react';
import type { DailyPlanState, DailyBlockId, IntensityMode } from '../../lib/english_engine_types';
import { DAILY_BLOCKS, INTENSITY_LABELS } from '../../data/english_daily_blocks';
import { getWeekInfo } from '../../data/english_curriculum';
import { getOrCreateTodayPlan, toggleBlock, setTodayIntensity, getDueSrsCards } from '../../lib/english_engine_storage';
import { seedInitialDeckIfEmpty } from '../../data/english_engine_seed';
import type { SrsCard } from '../../lib/srs';
import { SrsReviewTrainer } from './SrsReviewTrainer';

export function DailyPlanScreen({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [plan, setPlan] = useState<DailyPlanState | null>(null);
  const [streak, setStreak] = useState(0);
  const [dueCards, setDueCards] = useState<SrsCard[]>([]);
  const [reviewing, setReviewing] = useState(false);

  const refresh = useCallback(async () => {
    await seedInitialDeckIfEmpty(userId);
    const { progress, plan: todayPlan } = await getOrCreateTodayPlan(userId);
    setPlan(todayPlan);
    setStreak(progress.streak.count);
    setDueCards(await getDueSrsCards(userId));
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!plan) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <div
          className="animate-spin"
          style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)' }}
        />
      </div>
    );
  }

  const info = getWeekInfo(plan.weekNumber);
  const doneCount = plan.blocks.filter((b) => b.completed).length;

  async function handleToggle(blockId: DailyBlockId) {
    await toggleBlock(userId, plan!.date, blockId);
    refresh();
  }

  async function handleIntensity(mode: IntensityMode) {
    await setTodayIntensity(userId, mode);
    refresh();
  }

  if (reviewing) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => { setReviewing(false); refresh(); }}
          className="text-xs font-semibold mb-5"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Sair da revisão
        </button>
        <SrsReviewTrainer
          userId={userId}
          cards={dueCards}
          onFinish={async () => {
            await toggleBlock(userId, plan!.date, 'srs_review');
            setReviewing(false);
            refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Plano de Hoje</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Semana {plan.weekNumber} de 26 — Fase {info.phase.id}: {info.phase.label}
          </p>
        </div>
        <div className="text-center shrink-0" style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 12, padding: '6px 14px' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ff4d6d', lineHeight: 1.2 }}>🔥 {streak}</p>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-secondary)' }}>DIAS</p>
        </div>
      </div>

      {info.isCheckpoint && (
        <div className="rounded-xl p-3 mb-4 text-sm font-semibold" style={{ background: 'rgba(249,212,35,0.1)', border: '1px solid rgba(249,212,35,0.3)', color: 'var(--warning)' }}>
          📍 Semana de checkpoint — bom momento para avaliar seu progresso.
        </div>
      )}

      {/* Intensity selector */}
      <div className="flex rounded-xl p-1 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}>
        {(['lite', 'completo', 'intensivo'] as IntensityMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleIntensity(mode)}
            className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: plan.intensity === mode ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)' : 'transparent',
              color: plan.intensity === mode ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {INTENSITY_LABELS[mode].label}
            <div style={{ fontSize: '0.62rem', fontWeight: 500, opacity: 0.85 }}>{INTENSITY_LABELS[mode].estimate}</div>
          </button>
        ))}
      </div>

      {/* Today's progress */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}>
        <div className="flex justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Progresso de hoje</span>
          <span className="text-sm font-extrabold" style={{ color: 'var(--accent)' }}>{doneCount}/{plan.blocks.length}</span>
        </div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${(doneCount / plan.blocks.length) * 100}%`,
              background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)',
              borderRadius: 99,
              transition: 'width 0.4s',
            }}
          />
        </div>
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-3">
        {plan.blocks.map((b) => {
          const def = DAILY_BLOCKS[b.blockId];
          const isSrs = b.blockId === 'srs_review';
          return (
            <div
              key={b.blockId}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: b.completed ? 'rgba(16,240,160,0.06)' : 'var(--bg-card)',
                border: `1px solid ${b.completed ? 'rgba(16,240,160,0.25)' : 'var(--border-glow)'}`,
              }}
            >
              <button
                onClick={() => handleToggle(b.blockId)}
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: b.completed ? 'rgba(16,240,160,0.15)' : 'var(--bg-secondary)',
                  border: `1px solid ${b.completed ? 'rgba(16,240,160,0.4)' : 'var(--border)'}`,
                  color: b.completed ? '#10f0a0' : 'var(--text-secondary)',
                  fontWeight: 700,
                }}
              >
                {b.completed ? '✓' : ''}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{def.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{def.instruction}</p>
                {!isSrs && (
                  <p className="text-[0.65rem] mt-1 italic" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                    Conteúdo guiado ainda não disponível nesta fase — marque manualmente quando praticar.
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>{def.minutes} min</p>
                {isSrs && (
                  <button
                    onClick={() => setReviewing(true)}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    {dueCards.length > 0 ? `Revisar (${dueCards.length})` : 'Revisar'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onBack} className="mt-6 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
        ← Voltar ao painel
      </button>
    </div>
  );
}
