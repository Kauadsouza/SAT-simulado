import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
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
  const textColor = theme === 'dark' ? '#7b82a8' : '#6b7280';
  const gridColor = theme === 'dark' ? '#1e2440' : '#dde2f5';

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
        className="flex items-center gap-1.5 mb-5 text-sm font-semibold transition-opacity hover:opacity-70"
        style={{ color: 'var(--accent)' }}
      >
        ← Voltar ao histórico
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2
            className="text-2xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {TIER_LABELS[session.mode]}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {new Date(session.completedAt ?? session.startedAt).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="text-right">
          <div
            className="text-4xl font-black"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {session.totalScaled}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            RW: <strong style={{ color: 'var(--success)' }}>{session.rwScaled}</strong>
            {' · '}
            Math: <strong style={{ color: 'var(--warning)' }}>{session.mathScaled}</strong>
          </div>
        </div>
      </div>

      {/* Domain bar chart */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
      >
        <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
          Desempenho por Domínio
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 11 }} unit="%" />
            <Tooltip
              formatter={(val, _name, props) => [`${val}% (${props.payload.correct}/${props.payload.total})`, props.payload.fullName]}
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glow)', borderRadius: 10 }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--text-secondary)' }}
            />
            <Bar dataKey="pct" name="Acurácia" radius={[6, 6, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.pct >= 70 ? '#10f0a0' : entry.pct >= 50 ? '#f9d423' : '#ff4d6d'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Module timing */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(session.modules).map(([id, mod]) => {
          if (!mod) return null;
          const dur = mod.endTime && mod.startTime ? Math.round((mod.endTime - mod.startTime) / 60000) : null;
          const pct = mod.totalCount > 0 ? Math.round((mod.correctCount / mod.totalCount) * 100) : 0;
          return (
            <div
              key={id}
              className="rounded-2xl p-3 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
            >
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>
                {id.replace(/_/g, ' ')}
              </div>
              <div
                className="font-black text-lg"
                style={{ color: pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)' }}
              >
                {mod.correctCount}/{mod.totalCount}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {dur ? `${dur} min` : '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Question review */}
      <div>
        <h3 className="font-bold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>
          Revisão por Questão
        </h3>
        {Object.entries(session.modules).map(([moduleId, mod]) => {
          if (!mod) return null;
          return (
            <div key={moduleId} className="mb-6">
              <h4
                className="text-xs font-bold mb-3 uppercase tracking-widest"
                style={{ color: 'var(--text-secondary)' }}
              >
                {moduleId.replace(/_/g, ' ')} — {mod.questions.length} questões
              </h4>
              <div className="space-y-3">
                {mod.questions.map((q, i) => {
                  const s = mod.states[i];
                  const correct = gradeAnswer(q.type, s.selectedAnswer, q.answer);
                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl p-4"
                      style={{
                        background: 'var(--bg-card)',
                        border: `1px solid ${correct ? 'rgba(16,240,160,0.25)' : 'rgba(255,77,109,0.25)'}`,
                        boxShadow: correct ? '0 0 10px rgba(16,240,160,0.04)' : '0 0 10px rgba(255,77,109,0.04)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          Q{i + 1} · {DOMAIN_LABELS[q.domain]}
                        </span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: correct ? 'rgba(16,240,160,0.12)' : 'rgba(255,77,109,0.12)',
                            color: correct ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {correct ? '✓ Correto' : '✗ Errado'}
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
                          Sua resposta:{' '}
                          <strong style={{ color: s.selectedAnswer ? (correct ? 'var(--success)' : 'var(--danger)') : 'var(--text-secondary)' }}>
                            {s.selectedAnswer ?? '(em branco)'}
                          </strong>
                        </span>
                        {!correct && (
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Correta: <strong style={{ color: 'var(--success)' }}>{q.answer}</strong>
                          </span>
                        )}
                      </div>

                      <details className="mt-2">
                        <summary
                          className="text-xs cursor-pointer font-semibold"
                          style={{ color: 'var(--accent)' }}
                        >
                          Ver explicação
                        </summary>
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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

  const textColor = theme === 'dark' ? '#7b82a8' : '#6b7280';
  const gridColor = theme === 'dark' ? '#1e2440' : '#dde2f5';

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

  const domainAgg = domainStats(sessions);
  const barData = Object.entries(domainAgg).map(([domain, { correct, total }]) => ({
    name: DOMAIN_LABELS[domain]?.split(' ')[0] ?? domain,
    fullName: DOMAIN_LABELS[domain] ?? domain,
    correct,
    total,
    pct: total > 0 ? Math.round((correct / total) * 100) : 0,
  }));

  const TIER_ICONS: Record<string, string> = { easy: '🌱', medium: '⚡', hard: '🔥' };
  const SCORE_COLOR = (total: number) => {
    if (total >= 1400) return 'var(--success)';
    if (total >= 1200) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {selected ? (
        <SessionDetail session={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
          <div className="mb-8">
            <h1
              className="text-3xl font-black tracking-tight mb-1"
              style={{
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--purple) 60%, var(--cyan) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Histórico
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Todos os testes concluídos por {user?.name}.
            </p>
          </div>

          {sessions.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-glow)' }}
            >
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Nenhum teste concluído</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Faça seu primeiro teste para ver o histórico aqui.
              </p>
            </div>
          ) : (
            <>
              {/* Aggregate chart */}
              <div
                className="rounded-2xl p-5 mb-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
              >
                <h3 className="font-bold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                  Desempenho Agregado por Domínio
                </h3>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: textColor, fontSize: 11 }} unit="%" />
                    <YAxis type="category" dataKey="name" tick={{ fill: textColor, fontSize: 11 }} width={90} />
                    <Tooltip
                      formatter={(val, _n, props) => [`${val}% (${props.payload.correct}/${props.payload.total})`, props.payload.fullName]}
                      contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glow)', borderRadius: 10 }}
                      labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    />
                    <Bar dataKey="pct" name="Acurácia" radius={[0, 6, 6, 0]}>
                      {barData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.pct >= 70 ? '#10f0a0' : entry.pct >= 50 ? '#f9d423' : '#ff4d6d'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sessions list */}
              <div className="space-y-3">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="w-full rounded-2xl p-4 flex items-center justify-between text-left card-hover"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-glow)',
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        {TIER_ICONS[s.mode] ?? '📝'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {TIER_LABELS[s.mode]} — {new Date(s.completedAt ?? s.startedAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          RW: {s.rwScaled} · Math: {s.mathScaled}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="text-2xl font-black"
                        style={{ color: SCORE_COLOR(s.totalScaled ?? 0) }}
                      >
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
