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

  const lineData = completed.slice(-10).map((s, i) => ({
    name: `#${i + 1}`,
    RW: s.rwScaled ?? 0,
    Math: s.mathScaled ?? 0,
    Total: s.totalScaled ?? 0,
  }));

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

  const sorted = [...radarData].sort((a, b) => a.pct - b.pct);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  const textColor = theme === 'dark' ? '#7b82a8' : '#6b7280';
  const gridColor = theme === 'dark' ? '#1e2440' : '#dde2f5';

  const paused = !activeSession
    ? null
    : ['rw1', 'rw2', 'math1', 'math2_easy', 'math2_hard'].includes(activeSession.phase)
    ? activeSession
    : null;

  const statCards = [
    { label: 'Best Score', value: best || '—', sub: 'out of 1600', accent: 'var(--accent)', glow: 'var(--accent-glow)', icon: '🏆' },
    { label: 'Average', value: avg || '—', sub: 'all completed tests', accent: 'var(--cyan)', glow: 'rgba(34,211,238,0.25)', icon: '📊' },
    { label: 'Tests Taken', value: completed.length, sub: 'completed', accent: 'var(--success)', glow: 'rgba(16,240,160,0.2)', icon: '✅' },
    { label: 'Weakest Area', value: weakest?.domain?.split(' ')[0] ?? '—', sub: weakest ? `${weakest.pct}% correct` : 'no data yet', accent: 'var(--danger)', glow: 'rgba(255,77,109,0.2)', icon: '⚠️' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-black tracking-tight mb-1"
          style={{
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 60%, var(--purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Acompanhe seu progresso e inicie um novo simulado.
        </p>
      </div>

      {/* Paused session banner */}
      {paused && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center justify-between gap-3"
          style={{
            background: 'rgba(249,212,35,0.08)',
            border: '1px solid rgba(249,212,35,0.35)',
            boxShadow: '0 0 30px rgba(249,212,35,0.07)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: 'rgba(249,212,35,0.15)' }}
            >
              ⏸️
            </div>
            <div>
              <span className="font-semibold text-sm" style={{ color: 'var(--warning)' }}>
                Teste em andamento — modo {paused.mode}
              </span>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Fase: {paused.phase.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/exam')}
            className="px-4 py-2 rounded-xl text-sm font-bold shrink-0 ml-4 transition-all hover:opacity-90"
            style={{ background: 'var(--warning)', color: '#000' }}
          >
            Continuar →
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 card-hover"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glow)',
              boxShadow: `0 0 0 1px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.15)`,
            }}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div
              className="text-2xl font-black mb-0.5"
              style={{ color: card.accent }}
            >
              {card.value}
            </div>
            <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              {card.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 0 40px rgba(99,102,241,0.08)',
        }}
      >
        {/* Background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 200, height: 200, right: -40, top: -60,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        <div className="relative">
          <h2 className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
            Pronto para praticar?
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Escolha Fácil, Médio ou Difícil e faça um simulado SAT completo e adaptativo.
          </p>
        </div>
        <button
          onClick={() => navigate('/simulados')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold whitespace-nowrap shrink-0 transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            color: '#fff',
            boxShadow: '0 4px 20px var(--accent-glow)',
          }}
        >
          Iniciar Teste →
        </button>
      </div>

      {/* Charts */}
      {completed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            className="rounded-2xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
          >
            <h3 className="font-bold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>
              Evolução de Pontuação
            </h3>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
                <YAxis domain={[400, 1600]} tick={{ fill: textColor, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glow)', borderRadius: 10 }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--text-secondary)' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Total" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="RW" stroke="#10f0a0" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                <Line type="monotone" dataKey="Math" stroke="#f9d423" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
          >
            <h3 className="font-bold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>
              Desempenho por Domínio (% acerto)
            </h3>
            <ResponsiveContainer width="100%" height={170}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="domain" tick={{ fill: textColor, fontSize: 10 }} />
                <Radar name="Acurácia %" dataKey="pct" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl p-10 mb-8 text-center"
          style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-glow)' }}
        >
          <div className="text-4xl mb-3">📈</div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Nenhum dado ainda</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Complete seu primeiro teste para ver gráficos e análise de domínios aqui.
          </p>
        </div>
      )}

      {/* Domain insights */}
      {(weakest || strongest) && completed.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strongest && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: 'rgba(16,240,160,0.06)',
                border: '1px solid rgba(16,240,160,0.25)',
              }}
            >
              <div className="text-2xl">🏅</div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: 'var(--success)' }}>
                  Ponto Forte
                </div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{strongest.domain}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{strongest.pct}% de acerto</div>
              </div>
            </div>
          )}
          {weakest && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: 'rgba(255,77,109,0.06)',
                border: '1px solid rgba(255,77,109,0.25)',
              }}
            >
              <div className="text-2xl">🎯</div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: 'var(--danger)' }}>
                  Precisa Melhorar
                </div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weakest.domain}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{weakest.pct}% de acerto — foque aqui</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
