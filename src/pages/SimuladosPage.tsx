import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import { useAppStore } from '../store/appStore';
import { db } from '../db/index';
import type { ExamSession, Tier } from '../lib/types';
import { TIER_LABELS, TIER_DESCRIPTIONS } from '../lib/constants';

const TIER_CONFIG: Record<Tier, { accent: string; glow: string; bg: string; icon: string; badge: string }> = {
  easy: {
    accent: 'var(--success)',
    glow: 'rgba(16,240,160,0.25)',
    bg: 'rgba(16,240,160,0.06)',
    icon: '🌱',
    badge: 'Iniciante',
  },
  medium: {
    accent: 'var(--accent)',
    glow: 'var(--accent-glow)',
    bg: 'rgba(99,102,241,0.06)',
    icon: '⚡',
    badge: 'Intermediário',
  },
  hard: {
    accent: 'var(--danger)',
    glow: 'rgba(255,77,109,0.25)',
    bg: 'rgba(255,77,109,0.06)',
    icon: '🔥',
    badge: 'Avançado',
  },
};

export function SimuladosPage() {
  const { user } = useAppStore();
  const { startExam, session: activeSession, loadSession, abandonExam } = useExamStore();
  const navigate = useNavigate();
  const [pendingSessions, setPendingSessions] = useState<ExamSession[]>([]);
  const [showConfirm, setShowConfirm] = useState<Tier | null>(null);

  useEffect(() => {
    if (!user) return;
    db.sessions
      .where('userId')
      .equals(user.name)
      .toArray()
      .then((rows) => {
        setPendingSessions(
          rows.filter((s) => s.phase !== 'complete' && s.phase !== 'idle' && s.userId === user.name)
        );
      });
  }, [user]);

  const handleStart = (tier: Tier) => {
    if (pendingSessions.length > 0) {
      setShowConfirm(tier);
    } else {
      doStart(tier);
    }
  };

  const doStart = (tier: Tier) => {
    startExam(user!.name, tier);
    navigate('/exam');
  };

  const handleResume = (s: ExamSession) => {
    loadSession(s);
    navigate('/exam');
  };

  const handleDiscard = async (id: string) => {
    await db.sessions.delete(id);
    setPendingSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSession?.id === id) {
      await abandonExam();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-black tracking-tight mb-1"
          style={{
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 60%, var(--cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Simulados
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Escolha o nível de dificuldade. Cada teste é um simulado SAT completo e adaptativo (4 módulos, ~2h 14min).
        </p>
      </div>

      {/* Tier cards */}
      <div className="flex flex-col gap-4 mb-10">
        {(['easy', 'medium', 'hard'] as Tier[]).map((tier) => {
          const cfg = TIER_CONFIG[tier];
          return (
            <div
              key={tier}
              className="rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card-hover relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${cfg.bg} 0%, var(--bg-card) 60%)`,
                border: `1px solid color-mix(in srgb, ${cfg.accent} 25%, var(--border-glow))`,
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                style={{ background: cfg.accent, boxShadow: `0 0 10px ${cfg.glow}` }}
              />

              <div className="flex items-start gap-3 pl-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: cfg.bg, boxShadow: `0 0 16px ${cfg.glow}` }}
                >
                  {cfg.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                      {TIER_LABELS[tier]}
                    </h2>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: cfg.bg, color: cfg.accent, border: `1px solid ${cfg.accent}44` }}
                    >
                      {cfg.badge}
                    </span>
                  </div>
                  <p className="text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>
                    {TIER_DESCRIPTIONS[tier]}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>54 questões R&amp;W</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>44 questões Math</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>~2h 14min</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStart(tier)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold shrink-0 transition-all hover:opacity-90 text-center"
                style={{
                  background: tier === 'easy'
                    ? 'linear-gradient(135deg, #10f0a0 0%, #06d68a 100%)'
                    : tier === 'medium'
                    ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)'
                    : 'linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%)',
                  color: tier === 'easy' ? '#000' : '#fff',
                  boxShadow: `0 4px 16px ${cfg.glow}`,
                }}
              >
                Iniciar
              </button>
            </div>
          );
        })}
      </div>

      {/* In-progress sessions */}
      {pendingSessions.length > 0 && (
        <div>
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Em andamento
          </h2>
          <div className="space-y-3">
            {pendingSessions.map((s) => {
              const cfg = TIER_CONFIG[s.mode];
              return (
                <div
                  key={s.id}
                  className="rounded-2xl p-4 flex items-center justify-between"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glow)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cfg.icon}</span>
                    <div>
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {TIER_LABELS[s.mode]}
                      </span>
                      <span
                        className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: cfg.bg, color: cfg.accent }}
                      >
                        {s.phase.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Iniciado {new Date(s.startedAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResume(s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                        color: '#fff',
                        boxShadow: '0 2px 8px var(--accent-glow)',
                      }}
                    >
                      Retomar
                    </button>
                    <button
                      onClick={() => handleDiscard(s.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                      style={{
                        background: 'rgba(255,77,109,0.08)',
                        border: '1px solid rgba(255,77,109,0.25)',
                        color: 'var(--danger)',
                      }}
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glow)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
              Iniciar novo teste?
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              Você tem um teste em andamento. Iniciar um novo não vai apagar o anterior — você pode retomá-lo depois.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => { setShowConfirm(null); doStart(showConfirm); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 14px var(--accent-glow)',
                }}
              >
                Iniciar Novo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
