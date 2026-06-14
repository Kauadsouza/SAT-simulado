import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import { useAppStore } from '../store/appStore';
import { db } from '../db/index';
import type { ExamSession, Tier } from '../lib/types';
import { TIER_LABELS, TIER_DESCRIPTIONS } from '../lib/constants';

const TIER_COLORS: Record<Tier, string> = {
  easy: 'var(--success)',
  medium: 'var(--accent)',
  hard: 'var(--danger)',
};

const TIER_ICONS: Record<Tier, string> = {
  easy: '🌱',
  medium: '⚡',
  hard: '🔥',
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
          rows.filter(
            (s) =>
              s.phase !== 'complete' &&
              s.phase !== 'idle' &&
              s.userId === user.name
          )
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
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Practice Tests
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        Choose a difficulty level. Each test is a full adaptive SAT simulation (4 modules, ~2h 14min).
      </p>

      {/* Tier cards */}
      <div className="grid gap-4 mb-10">
        {(['easy', 'medium', 'hard'] as Tier[]).map((tier) => (
          <div
            key={tier}
            className="rounded-2xl p-6 flex items-center justify-between"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{TIER_ICONS[tier]}</span>
              <div>
                <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  {TIER_LABELS[tier]}
                </h2>
                <p className="text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>
                  {TIER_DESCRIPTIONS[tier]}
                </p>
                <div className="flex gap-3 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>54 R&amp;W questions</span>
                  <span>·</span>
                  <span>44 Math questions</span>
                  <span>·</span>
                  <span>~2h 14min</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleStart(tier)}
              className="px-5 py-2.5 rounded-xl font-semibold ml-4 shrink-0 transition-colors"
              style={{ background: TIER_COLORS[tier], color: tier === 'easy' ? '#000' : '#fff' }}
            >
              Start
            </button>
          </div>
        ))}
      </div>

      {/* In-progress sessions */}
      {pendingSessions.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            IN PROGRESS
          </h2>
          <div className="space-y-3">
            {pendingSessions.map((s) => (
              <div
                key={s.id}
                className="rounded-xl p-4 flex items-center justify-between"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div>
                  <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {TIER_ICONS[s.mode]} {TIER_LABELS[s.mode]} — {s.phase.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Started {new Date(s.startedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResume(s)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => handleDiscard(s.id)}
                    className="px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--danger)' }}
                  >
                    Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm overwrite dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="rounded-xl p-6 max-w-sm w-full mx-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Start new test?
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              You have a test in progress. Starting a new one won't delete the saved one — you can resume it later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowConfirm(null); doStart(showConfirm); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Start New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
