import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '../store/appStore';
import { db } from '../db/index';
import type { ExamSession } from '../lib/types';
import { DOMAIN_LABELS, TIER_LABELS } from '../lib/constants';
import { gradeAnswer } from '../lib/scoring';
import { MathText } from '../components/MathText';

function domainStats(sessions: ExamSession[]) {
  const map: Record<string, { correct: number; total: number }> = {};
  for (const s of sessions) {
    for (const mod of Object.values(s.modules)) {
      if (!mod) continue;
      for (let i = 0; i < mod.questions.length; i++) {
        const q = mod.questions[i];
        const st = mod.states[i];
        if (!map[q.domain]) map[q.domain] = { correct: 0, total: 0 };
        map[q.domain].total++;
        if (gradeAnswer(q.type, st.selectedAnswer, q.answer)) map[q.domain].correct++;
      }
    }
  }
  return map;
}

function SessionDetail({ session, onBack }: { session: ExamSession; onBack: () => void }) {
  const { theme } = useAppStore();
  const textColor = theme === 'dark' ? '#8b90a7' : '#6b7280';
  const gridColor = theme === 'dark' ? '#2d3148' : '#dde1ef';

  const domainMap = domainStats([session]);
  const barData = Object.entries(domainMap).map(([domain, { correct, total }]) => ({
    name: DOMAIN_LABELS[domain]?.split(' ')[0] ?? domain,
    fullName: DOMAIN_LABELS[domain] ?? domain,
    pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    correct,
    total,
  }));

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 mb-5 text-sm transition-colors"
        style={{ color: 'var(--accent)' }}
      >
        ← Back to history
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {TIER_LABELS[session.mode]} Test
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {new Date(session.completedAt ?? session.startedAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
            {session.totalScaled}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            RW: {session.rwScaled} · Math: {session.mathScaled}
          </div>
        </div>
      </div>

      {/* Domain bar chart */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
          Performance by Domain
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 11 }} unit="%" />
            <Tooltip
              formatter={(val, _name, props) => [`${val}% (${props.payload.correct}/${props.payload.total})`, props.payload.fullName]}
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--text-secondary)' }}
            />
            <Bar dataKey="pct" name="Accuracy" fill="#4f7cff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Module timing */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(session.modules).map(([id, mod]) => {
          if (!mod) return null;
          const dur = mod.endTime && mod.startTime ? Math.round((mod.endTime - mod.startTime) / 60000) : null;
          return (
            <div key={id} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                {id.toUpperCase()}
              </div>
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                {mod.correctCount}/{mod.totalCount}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {dur ? `${dur} min` : '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Question-by-question review */}
      <div>
        <h3 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>
          Question Review
        </h3>
        {Object.entries(session.modules).map(([moduleId, mod]) => {
          if (!mod) return null;
          return (
            <div key={moduleId} className="mb-6">
              <h4 className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                {moduleId} — {mod.questions.length} questions
              </h4>
              <div className="space-y-3">
                {mod.questions.map((q, i) => {
                  const s = mod.states[i];
                  const correct = gradeAnswer(q.type, s.selectedAnswer, q.answer);
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl p-4"
                      style={{
                        background: 'var(--bg-card)',
                        border: `1px solid ${correct ? 'color-mix(in srgb, var(--success) 40%, var(--border))' : 'color-mix(in srgb, var(--danger) 40%, var(--border))'}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          Q{i + 1} · {DOMAIN_LABELS[q.domain]}
                        </span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: correct ? 'color-mix(in srgb, var(--success) 20%, transparent)' : 'color-mix(in srgb, var(--danger) 20%, transparent)',
                            color: correct ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {correct ? '✓ Correct' : '✗ Wrong'}
                        </span>
                      </div>

                      {q.passage && (
                        <p className="text-xs mb-2 italic" style={{ color: 'var(--text-secondary)' }}>
                          "{q.passage.slice(0, 100)}{q.passage.length > 100 ? '…' : ''}"
                        </p>
                      )}

                      <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                        <MathText text={q.prompt} />
                      </p>

                      <div className="flex gap-4 text-xs">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Your answer: <strong style={{ color: s.selectedAnswer ? (correct ? 'var(--success)' : 'var(--danger)') : 'var(--text-secondary)' }}>
                            {s.selectedAnswer ?? '(blank)'}
                          </strong>
                        </span>
                        {!correct && (
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Correct: <strong style={{ color: 'var(--success)' }}>{q.answer}</strong>
                          </span>
                        )}
                      </div>

                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer" style={{ color: 'var(--accent)' }}>
                          Show explanation
                        </summary>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {q.explanation}
                        </p>
                      </details>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HistoricoPage() {
  const { user, theme } = useAppStore();
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [selected, setSelected] = useState<ExamSession | null>(null);

  const textColor = theme === 'dark' ? '#8b90a7' : '#6b7280';
  const gridColor = theme === 'dark' ? '#2d3148' : '#dde1ef';

  useEffect(() => {
    if (!user) return;
    db.sessions
      .where('userId')
      .equals(user.name)
      .toArray()
      .then((rows) => {
        setSessions(
          rows
            .filter((s) => s.phase === 'complete')
            .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
        );
      });
  }, [user]);

  // Aggregate domain stats
  const domainAgg = domainStats(sessions);
  const barData = Object.entries(domainAgg).map(([domain, { correct, total }]) => ({
    name: DOMAIN_LABELS[domain]?.split(' ')[0] ?? domain,
    fullName: DOMAIN_LABELS[domain] ?? domain,
    correct,
    total,
    pct: total > 0 ? Math.round((correct / total) * 100) : 0,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {selected ? (
        <SessionDetail session={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            History
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            All completed tests for {user?.name}.
          </p>

          {sessions.length === 0 ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p style={{ color: 'var(--text-secondary)' }}>No completed tests yet. Take your first test!</p>
            </div>
          ) : (
            <>
              {/* Aggregate domain performance */}
              <div
                className="rounded-xl p-5 mb-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                  Aggregate Domain Performance
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: textColor, fontSize: 11 }} unit="%" />
                    <YAxis type="category" dataKey="name" tick={{ fill: textColor, fontSize: 11 }} width={80} />
                    <Tooltip
                      formatter={(val, _n, props) => [`${val}% (${props.payload.correct}/${props.payload.total})`, props.payload.fullName]}
                      contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8 }}
                      labelStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Bar dataKey="pct" name="Accuracy" fill="#4f7cff" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sessions list */}
              <div className="space-y-3">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="w-full rounded-xl p-4 flex items-center justify-between text-left transition-all hover:opacity-90"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  >
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {TIER_LABELS[s.mode]} — {new Date(s.completedAt ?? s.startedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        RW: {s.rwScaled} · Math: {s.mathScaled} · {new Date(s.completedAt ?? s.startedAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                        {s.totalScaled}
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
