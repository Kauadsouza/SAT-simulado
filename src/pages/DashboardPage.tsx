import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from 'recharts';
import { useAppStore } from '../store/appStore';
import { useExamStore } from '../store/examStore';
import { db } from '../db/index';
import type { ExamSession } from '../lib/types';
import { DOMAIN_LABELS } from '../lib/constants';
import { gradeAnswer } from '../lib/scoring';

export function DashboardPage() {
  const { user, theme } = useAppStore();
  const { session: activeSession } = useExamStore();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ExamSession[]>([]);

  useEffect(() => {
    if (!user) return;
    db.sessions
      .where('userId')
      .equals(user.name)
      .toArray()
      .then((rows) => {
        const completed = rows
          .filter((s) => s.phase === 'complete')
          .sort((a, b) => (a.completedAt ?? 0) - (b.completedAt ?? 0));
        setSessions(completed);
      });
  }, [user]);

  const completed = sessions;
  const best = completed.reduce((max, s) => Math.max(max, s.totalScaled ?? 0), 0);
  const avg = completed.length
    ? Math.round(completed.reduce((sum, s) => sum + (s.totalScaled ?? 0), 0) / completed.length)
    : 0;

  // Chart data
  const lineData = completed.slice(-10).map((s, i) => ({
    name: `Test ${i + 1}`,
    RW: s.rwScaled ?? 0,
    Math: s.mathScaled ?? 0,
    Total: s.totalScaled ?? 0,
  }));

  // Domain aggregates
  const domainAgg: Record<string, { correct: number; total: number }> = {};
  for (const s of completed) {
    for (const mod of Object.values(s.modules)) {
      if (!mod) continue;
      for (let i = 0; i < mod.questions.length; i++) {
        const q = mod.questions[i];
        const st = mod.states[i];
        if (!domainAgg[q.domain]) domainAgg[q.domain] = { correct: 0, total: 0 };
        domainAgg[q.domain].total++;
        if (gradeAnswer(q.type, st.selectedAnswer, q.answer)) domainAgg[q.domain].correct++;
      }
    }
  }

  const radarData = Object.entries(domainAgg).map(([domain, { correct, total }]) => ({
    domain: DOMAIN_LABELS[domain] ?? domain,
    pct: total > 0 ? Math.round((correct / total) * 100) : 0,
  }));

  // Find weakest domain
  const weakest = radarData.sort((a, b) => a.pct - b.pct)[0];
  const strongest = [...radarData].sort((a, b) => b.pct - a.pct)[0];

  const textColor = theme === 'dark' ? '#8b90a7' : '#6b7280';
  const gridColor = theme === 'dark' ? '#2d3148' : '#dde1ef';

  const paused = !activeSession
    ? null
    : ['rw1', 'rw2', 'math1', 'math2_easy', 'math2_hard'].includes(activeSession.phase)
    ? activeSession
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Track your SAT progress and start a new practice test.
        </p>
      </div>

      {/* Paused session banner */}
      {paused && (
        <div
          className="rounded-xl p-4 mb-6 flex items-center justify-between"
          style={{ background: 'color-mix(in srgb, var(--warning) 12%, transparent)', border: '1px solid var(--warning)' }}
        >
          <div>
            <span className="font-semibold text-sm" style={{ color: 'var(--warning)' }}>
              Test in progress — {paused.mode} mode
            </span>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Phase: {paused.phase}
            </p>
          </div>
          <button
            onClick={() => navigate('/exam')}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--warning)', color: '#000' }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Best Score', value: best || '—', sub: 'out of 1600' },
          { label: 'Average Score', value: avg || '—', sub: 'all tests' },
          { label: 'Tests Taken', value: completed.length, sub: 'completed' },
          { label: 'Weakest Area', value: weakest?.domain?.split(' ')[0] ?? '—', sub: weakest ? `${weakest.pct}% correct` : 'no data yet' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {card.value}
            </div>
            <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {card.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl p-6 mb-8 flex items-center justify-between"
        style={{ background: 'color-mix(in srgb, var(--accent) 8%, var(--bg-card))', border: '1px solid color-mix(in srgb, var(--accent) 30%, var(--border))' }}
      >
        <div>
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Ready to practice?</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Choose Easy, Medium, or Hard and take a full adaptive SAT simulation.
          </p>
        </div>
        <button
          onClick={() => navigate('/simulados')}
          className="px-6 py-3 rounded-xl font-semibold whitespace-nowrap ml-4"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Start Test →
        </button>
      </div>

      {/* Charts */}
      {completed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Score evolution */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
              Score Evolution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
                <YAxis domain={[400, 1600]} tick={{ fill: textColor, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-secondary)' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Total" stroke="#4f7cff" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="RW" stroke="#34d399" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                <Line type="monotone" dataKey="Math" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Domain radar */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
              Performance by Domain (% correct)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="domain" tick={{ fill: textColor, fontSize: 10 }} />
                <Radar name="Accuracy %" dataKey="pct" stroke="#4f7cff" fill="#4f7cff" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl p-8 mb-8 text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Complete your first test to see charts and domain analysis here.
          </p>
        </div>
      )}

      {/* Insights */}
      {(weakest || strongest) && completed.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strongest && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'color-mix(in srgb, var(--success) 8%, var(--bg-card))', border: '1px solid color-mix(in srgb, var(--success) 30%, var(--border))' }}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--success)' }}>Strongest Domain</div>
              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{strongest.domain}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{strongest.pct}% correct</div>
            </div>
          )}
          {weakest && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'color-mix(in srgb, var(--danger) 8%, var(--bg-card))', border: '1px solid color-mix(in srgb, var(--danger) 30%, var(--border))' }}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--danger)' }}>Needs Improvement</div>
              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weakest.domain}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{weakest.pct}% correct — focus here</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
