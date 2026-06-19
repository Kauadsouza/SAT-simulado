import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import type { UserEnglishProgress, PlacementAnswer, PlacementResult, CEFRLevel } from '../lib/english_types';
import {
  loadEnglishProgress,
  savePlacementResult,
  completeLessonForUser,
  resetPlacement,
  addXpAndStreak,
} from '../lib/english_storage';
import { getVocabStats, type VocabStats } from '../lib/vocab_store';
import { VocabTrainer } from '../components/english/VocabTrainer';
import { ListeningTrainer } from '../components/english/ListeningTrainer';
import { SpeakingTrainer } from '../components/english/SpeakingTrainer';
import { PLACEMENT_QUESTIONS, LESSONS, QUESTION_MAP, LESSONS_PER_LEVEL } from '../data/english_data';
import {
  calculatePlacementLevel,
  CEFR_LABELS,
  CEFR_DESCRIPTIONS,
  CEFR_ORDER,
  cefrIndex,
  isDispensed,
  isLocked,
  XP_PER_LESSON,
  calcOverallProgress,
} from '../lib/english_scoring';

type Screen =
  | 'loading'
  | 'placement-intro'
  | 'placement-test'
  | 'placement-result'
  | 'study-dashboard'
  | 'study-lesson'
  | 'vocab'
  | 'listening'
  | 'speaking';

type ToolId = 'vocab' | 'listening' | 'speaking';

const LEVEL_COLORS: Record<CEFRLevel, { bg: string; text: string; border: string; shadow: string }> = {
  A1: { bg: 'rgba(16,240,160,0.12)', text: '#10f0a0', border: 'rgba(16,240,160,0.3)', shadow: 'rgba(16,240,160,0.2)' },
  A2: { bg: 'rgba(34,211,238,0.12)', text: '#22d3ee', border: 'rgba(34,211,238,0.3)', shadow: 'rgba(34,211,238,0.2)' },
  B1: { bg: 'rgba(99,102,241,0.12)', text: '#818cf8', border: 'rgba(99,102,241,0.3)', shadow: 'rgba(99,102,241,0.2)' },
  B2: { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)', shadow: 'rgba(139,92,246,0.2)' },
  C1: { bg: 'rgba(168,85,247,0.12)', text: '#c084fc', border: 'rgba(168,85,247,0.3)', shadow: 'rgba(168,85,247,0.2)' },
  C2: { bg: 'rgba(249,212,35,0.12)', text: '#f9d423', border: 'rgba(249,212,35,0.3)', shadow: 'rgba(249,212,35,0.2)' },
};

// ── Shared sub-component ──────────────────────────────────────────────────────
function LevelBadge({ level, size = 'md' }: { level: CEFRLevel; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const c = LEVEL_COLORS[level];
  const sizeMap = {
    sm: { padding: '2px 8px', fontSize: '0.7rem', borderRadius: 6 },
    md: { padding: '4px 12px', fontSize: '0.8rem', borderRadius: 8 },
    lg: { padding: '6px 18px', fontSize: '1.05rem', borderRadius: 10 },
    xl: { padding: '12px 32px', fontSize: '2.2rem', borderRadius: 14 },
  };
  return (
    <span
      style={{
        display: 'inline-block',
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 14px ${c.shadow}`,
        fontWeight: 800,
        letterSpacing: '0.04em',
        lineHeight: 1.3,
        ...sizeMap[size],
      }}
    >
      {level}
    </span>
  );
}

// ── PlacementIntro ────────────────────────────────────────────────────────────
function PlacementIntro({ onStart, isRetake }: { onStart: () => void; isRetake: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-md"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          borderRadius: 20,
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)',
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              boxShadow: '0 0 32px var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
          {isRetake ? 'Refazer Diagnóstico' : 'Diagnóstico de Inglês'}
        </h1>
        <p className="text-center mb-6" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isRetake
            ? 'Seu histórico de lições será resetado. Pronto para começar do zero?'
            : 'Descubra seu nível de inglês em poucos minutos — de A1 a C2.'}
        </p>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {[
            { icon: '📝', text: '15 questões' },
            { icon: '⏱️', text: '~10 min' },
            { icon: '🎯', text: 'A1 → C2' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '5px 12px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}
            >
              {icon} {text}
            </div>
          ))}
        </div>

        {/* Note */}
        <div
          style={{
            background: 'rgba(249,212,35,0.08)',
            border: '1px solid rgba(249,212,35,0.2)',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          💡 Não há feedback durante o teste. Responda com calma — você verá seu nível ao final.
        </div>

        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: '0.95rem',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px var(--accent-glow)',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0.88';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
            (e.currentTarget as HTMLElement).style.transform = 'none';
          }}
        >
          {isRetake ? 'Refazer diagnóstico' : 'Iniciar diagnóstico'}
        </button>
      </div>
    </div>
  );
}

// ── PlacementTest ─────────────────────────────────────────────────────────────
function PlacementTest({ onComplete }: { onComplete: (answers: PlacementAnswer[]) => void }) {
  const questions = PLACEMENT_QUESTIONS;
  const total = questions.length;
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const q = questions[qIdx];
  const pct = Math.round((qIdx / total) * 100);

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const ans: PlacementAnswer = { questionId: q.id, chosenIndex: i, correct: i === q.correctIndex };
    const next = [...answers, ans];
    setTimeout(() => {
      if (qIdx + 1 < total) {
        setAnswers(next);
        setSelected(null);
        setQIdx(qIdx + 1);
      } else {
        onComplete(next);
      }
    }, 380);
  }

  function handleDontKnow() {
    if (selected !== null) return;
    setSelected(-1);
    const ans: PlacementAnswer = { questionId: q.id, chosenIndex: -1, correct: false, dontKnow: true };
    const next = [...answers, ans];
    setTimeout(() => {
      if (qIdx + 1 < total) {
        setAnswers(next);
        setSelected(null);
        setQIdx(qIdx + 1);
      } else {
        onComplete(next);
      }
    }, 200);
  }

  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
      {/* Progress bar */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '12px 16px' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em' }}>
              DIAGNÓSTICO — {qIdx + 1} / {total}
            </span>
            <LevelBadge level={q.level} size="sm" />
          </div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)',
                borderRadius: 99,
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {q.passage && (
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glow)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: 12,
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                fontStyle: 'italic',
              }}
            >
              {q.passage}
            </div>
          )}

          <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.55, marginBottom: 20 }}>
            {q.prompt}
          </p>

          <div className="flex flex-col gap-3 mb-4">
            {q.options.map((opt, i) => {
              const active = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  style={{
                    textAlign: 'left',
                    padding: '13px 16px',
                    borderRadius: 12,
                    border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: active
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 100%)'
                      : 'var(--bg-card)',
                    color: active ? 'var(--accent)' : 'var(--text-primary)',
                    cursor: selected !== null ? 'default' : 'pointer',
                    boxShadow: active ? '0 0 14px var(--accent-glow)' : 'none',
                    transition: 'all 0.18s',
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: active ? 'var(--accent)' : 'var(--bg-secondary)',
                      border: active ? 'none' : '1px solid var(--border)',
                      color: active ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Não sei — skip without answering */}
          {selected === null && (
            <button
              onClick={handleDontKnow}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 12,
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'rgba(255,77,109,0.07)',
                border: '1px solid rgba(255,77,109,0.25)',
                color: 'var(--danger)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Não sei — pular
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PlacementResult ───────────────────────────────────────────────────────────
function PlacementResult({ result, onContinue }: { result: PlacementResult; onContinue: () => void }) {
  const { cefrLevel: level, perSkillAccuracy } = result;
  const c = LEVEL_COLORS[level];
  const skillLabels: Record<string, string> = {
    grammar: 'Gramática',
    vocabulary: 'Vocabulário',
    reading: 'Leitura',
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-md"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          borderRadius: 20,
          padding: '2rem',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${c.shadow}`,
        }}
      >
        {/* Large level badge */}
        <div className="flex flex-col items-center mb-5">
          <div
            style={{
              background: c.bg,
              border: `2px solid ${c.border}`,
              borderRadius: 18,
              padding: '18px 48px',
              boxShadow: `0 0 48px ${c.shadow}`,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: '3.5rem', fontWeight: 900, color: c.text, letterSpacing: '0.06em' }}>
              {level}
            </span>
          </div>
          <p className="font-bold text-lg text-center" style={{ color: 'var(--text-primary)', marginBottom: 6 }}>
            {CEFR_LABELS[level]}
          </p>
          <p
            className="text-center"
            style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.65, maxWidth: 340 }}
          >
            {CEFR_DESCRIPTIONS[level]}
          </p>
        </div>

        {/* Per-skill accuracy */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 22 }}>
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Desempenho por habilidade
          </p>
          {(Object.entries(perSkillAccuracy) as [string, number][]).map(([skill, pct]) => (
            <div key={skill} className="mb-3">
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {skillLabels[skill] ?? skill}
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: pct >= 65 ? '#10f0a0' : '#f9d423',
                  }}
                >
                  {pct}%
                </span>
              </div>
              <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background:
                      pct >= 65
                        ? 'linear-gradient(90deg, #10f0a0 0%, #22d3ee 100%)'
                        : 'linear-gradient(90deg, #f9d423 0%, #ff4d6d 100%)',
                    borderRadius: 99,
                    transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: '0.95rem',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px var(--accent-glow)',
          }}
        >
          Começar a estudar →
        </button>
      </div>
    </div>
  );
}

// ── StudyDashboard ────────────────────────────────────────────────────────────
function StudyDashboard({
  progress,
  onSelectLesson,
  onRetake,
  onOpenTool,
}: {
  progress: UserEnglishProgress;
  onSelectLesson: (id: string) => void;
  onRetake: () => void;
  onOpenTool: (tool: ToolId) => void;
}) {
  const level = progress.currentLevel!;
  const c = LEVEL_COLORS[level];

  const [vocab, setVocab] = useState<VocabStats | null>(null);
  useEffect(() => {
    getVocabStats(progress.userId, level).then(setVocab);
  }, [progress.userId, level]);

  const TOOLS: { id: ToolId; icon: string; title: string; sub: string }[] = [
    {
      id: 'vocab', icon: '🗂️', title: 'Vocabulário',
      sub: vocab
        ? (vocab.dueCount > 0 ? `${vocab.dueCount} para revisar` : `${vocab.newAvailable} palavras novas`)
        : 'Flashcards com áudio',
    },
    { id: 'listening', icon: '🎧', title: 'Listening', sub: 'Ditado por áudio' },
    { id: 'speaking', icon: '🎤', title: 'Speaking', sub: 'Pronúncia com nota' },
  ];

  const completedLevels = new Set<CEFRLevel>(
    CEFR_ORDER.filter((lvl) => {
      const ll = LESSONS.filter((l) => l.level === lvl);
      return ll.length > 0 && ll.every((l) => progress.lessonStatus[l.id]?.completed);
    })
  );

  const overallPct = calcOverallProgress(
    level,
    progress.lessonStatus,
    LESSONS_PER_LEVEL as Record<CEFRLevel, number>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header: level + XP + streak */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <LevelBadge level={level} size="lg" />
            <p className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
              {CEFR_LABELS[level]}
            </p>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Seu nível diagnosticado</p>
        </div>

        <div className="flex gap-3">
          <div
            style={{
              background: 'rgba(249,212,35,0.1)',
              border: '1px solid rgba(249,212,35,0.25)',
              borderRadius: 12,
              padding: '8px 16px',
              textAlign: 'center',
              minWidth: 60,
            }}
          >
            <p style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f9d423', lineHeight: 1.2 }}>
              {progress.xp}
            </p>
            <p style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
              XP
            </p>
          </div>
          <div
            style={{
              background: 'rgba(255,77,109,0.1)',
              border: '1px solid rgba(255,77,109,0.25)',
              borderRadius: 12,
              padding: '8px 16px',
              textAlign: 'center',
              minWidth: 60,
            }}
          >
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ff4d6d', lineHeight: 1.2 }}>
              🔥 {progress.streak.count}
            </p>
            <p style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
              DIAS
            </p>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          borderRadius: 14,
          padding: '14px 16px',
          marginBottom: 24,
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Progresso geral ({level} → C2)
          </span>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: c.text }}>{overallPct}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${overallPct}%`,
              background: `linear-gradient(90deg, ${c.text} 0%, var(--accent-2) 100%)`,
              borderRadius: 99,
              transition: 'width 0.6s',
            }}
          />
        </div>
      </div>

      {/* Practice tools — vocab SRS, listening, speaking */}
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
        Treino diário
      </p>
      <div className="grid grid-cols-3 gap-3 mb-7">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => onOpenTool(t.id)}
            className="rounded-2xl p-4 text-center transition-all"
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${t.id === 'vocab' && vocab && vocab.dueCount > 0 ? 'rgba(255,77,109,0.4)' : 'var(--border-glow)'}`,
            }}
          >
            <div className="text-2xl mb-1">{t.icon}</div>
            <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{t.title}</div>
            <div className="text-[0.65rem] leading-tight" style={{ color: 'var(--text-secondary)' }}>{t.sub}</div>
          </button>
        ))}
      </div>

      {/* Lesson map */}
      <div className="flex flex-col gap-4 mb-8">
        {CEFR_ORDER.map((lvl) => {
          const dispensed = isDispensed(level, lvl);
          const locked = !dispensed && isLocked(level, lvl, completedLevels);
          const levelLessons = LESSONS.filter((l) => l.level === lvl);
          if (levelLessons.length === 0) return null;
          const lc = LEVEL_COLORS[lvl];

          return (
            <div
              key={lvl}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${dispensed || locked ? 'var(--border)' : lc.border}`,
                borderRadius: 16,
                overflow: 'hidden',
                opacity: locked ? 0.5 : 1,
              }}
            >
              {/* Level section header */}
              <div
                style={{
                  padding: '11px 15px',
                  background: dispensed || locked ? 'transparent' : lc.bg,
                  borderBottom: `1px solid ${dispensed || locked ? 'var(--border)' : lc.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <LevelBadge level={lvl} size="sm" />
                <span
                  className="flex-1 text-sm font-semibold"
                  style={{ color: dispensed || locked ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                >
                  {lvl === level
                    ? '← Seu nível atual'
                    : dispensed
                    ? 'Dispensado'
                    : locked
                    ? '🔒 Bloqueado'
                    : ''}
                </span>
                {dispensed && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'rgba(16,240,160,0.1)',
                      color: '#10f0a0',
                      border: '1px solid rgba(16,240,160,0.25)',
                    }}
                  >
                    ✓ DISPENSADO
                  </span>
                )}
              </div>

              {/* Lessons */}
              {!locked && (
                <div className="p-3 flex flex-col gap-2">
                  {levelLessons.map((lesson) => {
                    const st = progress.lessonStatus[lesson.id];
                    const done = st?.completed ?? false;
                    const score = st?.bestScore != null ? Math.round(st.bestScore * 100) : null;

                    return (
                      <div
                        key={lesson.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: done ? 'rgba(16,240,160,0.06)' : 'var(--bg-secondary)',
                          border: `1px solid ${done ? 'rgba(16,240,160,0.2)' : 'var(--border)'}`,
                        }}
                      >
                        {/* Status icon */}
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            flexShrink: 0,
                            background: done ? 'rgba(16,240,160,0.15)' : 'var(--bg-card)',
                            border: `1px solid ${done ? 'rgba(16,240,160,0.35)' : 'var(--border)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            color: done ? '#10f0a0' : 'var(--text-secondary)',
                            fontWeight: 700,
                          }}
                        >
                          {done ? '✓' : '○'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="truncate font-semibold"
                            style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}
                          >
                            {lesson.title}
                          </p>
                          <p
                            className="truncate"
                            style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}
                          >
                            {lesson.description}
                          </p>
                        </div>

                        {/* Score badge */}
                        {score !== null && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 6,
                              background: done ? 'rgba(16,240,160,0.12)' : 'rgba(249,212,35,0.12)',
                              color: done ? '#10f0a0' : '#f9d423',
                              border: `1px solid ${done ? 'rgba(16,240,160,0.25)' : 'rgba(249,212,35,0.25)'}`,
                              flexShrink: 0,
                            }}
                          >
                            {score}%
                          </span>
                        )}

                        {!dispensed && (
                          <button
                            onClick={() => onSelectLesson(lesson.id)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 8,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: done
                                ? 'rgba(99,102,241,0.12)'
                                : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                              color: done ? 'var(--accent)' : '#fff',
                              border: done ? '1px solid rgba(99,102,241,0.25)' : 'none',
                              cursor: 'pointer',
                              flexShrink: 0,
                              transition: 'all 0.15s',
                            }}
                          >
                            {done ? 'Revisar' : 'Estudar'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {locked && (
                <div
                  style={{
                    padding: '10px 16px 14px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                  }}
                >
                  Complete as lições de {CEFR_ORDER[cefrIndex(lvl) - 1]} para desbloquear
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Retake */}
      <div className="flex justify-center pb-4">
        <button
          onClick={onRetake}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '8px 18px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glow)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
        >
          🔁 Refazer diagnóstico
        </button>
      </div>
    </div>
  );
}

// ── StudyLesson ───────────────────────────────────────────────────────────────
function StudyLesson({
  lessonId,
  onComplete,
  onBack,
}: {
  lessonId: string;
  onComplete: (score: number) => void;
  onBack: () => void;
}) {
  const lesson = LESSONS.find((l) => l.id === lessonId)!;
  const questions = lesson.questionIds.map((id) => QUESTION_MAP.get(id)!).filter(Boolean);
  const total = questions.length;

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [dontKnowCount, setDontKnowCount] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qIdx];
  const pct = Math.round((qIdx / total) * 100);

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.correctIndex) setCorrectCount((n) => n + 1);
  }

  function handleDontKnow() {
    if (selected !== null) return;
    setSelected(-1); // -1 = "não sei"
    setRevealed(true);
    setDontKnowCount((n) => n + 1);
  }

  function handleNext() {
    if (qIdx + 1 < total) {
      setQIdx(qIdx + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setDone(true);
    }
  }

  if (done) {
    const score = correctCount / total;
    const passed = score >= 0.7;
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-md"
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${passed ? 'rgba(16,240,160,0.3)' : 'rgba(255,77,109,0.3)'}`,
            borderRadius: 20,
            padding: '2rem',
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${passed ? 'rgba(16,240,160,0.15)' : 'rgba(255,77,109,0.15)'}`,
          }}
        >
          <div className="text-center mb-5">
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>{passed ? '🎉' : '💪'}</div>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              {passed ? 'Lição concluída!' : 'Continue praticando!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{lesson.title}</p>
          </div>

          {/* Score */}
          <div
            style={{
              background: passed ? 'rgba(16,240,160,0.08)' : 'rgba(255,77,109,0.08)',
              border: `1px solid ${passed ? 'rgba(16,240,160,0.2)' : 'rgba(255,77,109,0.2)'}`,
              borderRadius: 14,
              padding: 16,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '2.8rem', fontWeight: 900, color: passed ? '#10f0a0' : '#ff4d6d', lineHeight: 1.1 }}>
              {correctCount}/{total}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {Math.round(score * 100)}% de acerto
            </p>
          </div>

          {/* dontKnow breakdown */}
          {dontKnowCount > 0 && (
            <div style={{
              background: 'rgba(255,77,109,0.07)', border: '1px solid rgba(255,77,109,0.2)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 12,
              fontSize: '0.82rem', color: 'var(--danger)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>❓ Não sabia</span>
              <span style={{ fontWeight: 700 }}>{dontKnowCount}/{total}</span>
            </div>
          )}

          {passed && (
            <div
              style={{
                background: 'rgba(249,212,35,0.08)',
                border: '1px solid rgba(249,212,35,0.2)',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 16,
                textAlign: 'center',
                fontSize: '0.85rem',
                color: '#f9d423',
                fontWeight: 600,
              }}
            >
              +{XP_PER_LESSON} XP ganhos! ⭐
            </div>
          )}

          <button
            onClick={() => onComplete(score)}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px var(--accent-glow)',
            }}
          >
            Voltar ao painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '12px 16px' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                }}
              >
                ← Voltar
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {lesson.title} — {qIdx + 1}/{total}
              </span>
            </div>
            <LevelBadge level={lesson.level} size="sm" />
          </div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)',
                borderRadius: 99,
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {q.passage && (
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glow)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: 12,
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                fontStyle: 'italic',
              }}
            >
              {q.passage}
            </div>
          )}

          <p
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              fontWeight: 600,
              lineHeight: 1.55,
              marginBottom: 20,
            }}
          >
            {q.prompt}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-4">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correctIndex;
              let borderColor = 'var(--border)';
              let bg = 'var(--bg-card)';
              let color = 'var(--text-primary)';

              // selected === -1 means "Não sei" — only highlight correct, nothing red
              const isDontKnow = selected === -1;
              if (revealed) {
                if (isCorrect) {
                  borderColor = 'rgba(16,240,160,0.5)';
                  bg = 'rgba(16,240,160,0.08)';
                  color = '#10f0a0';
                } else if (isSelected && !isDontKnow) {
                  borderColor = 'rgba(255,77,109,0.5)';
                  bg = 'rgba(255,77,109,0.08)';
                  color = '#ff4d6d';
                }
              } else if (isSelected) {
                borderColor = 'var(--accent)';
                bg = 'rgba(99,102,241,0.12)';
                color = 'var(--accent)';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  style={{
                    textAlign: 'left',
                    padding: '13px 16px',
                    borderRadius: 12,
                    border: `${revealed && isCorrect ? '2px' : '1px'} solid ${borderColor}`,
                    background: bg,
                    color,
                    cursor: revealed ? 'default' : 'pointer',
                    transition: 'all 0.18s',
                    fontWeight: revealed && (isCorrect || isSelected) ? 600 : 400,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: revealed
                        ? isCorrect
                          ? 'rgba(16,240,160,0.2)'
                          : isSelected
                          ? 'rgba(255,77,109,0.2)'
                          : 'var(--bg-secondary)'
                        : isSelected
                        ? 'var(--accent)'
                        : 'var(--bg-secondary)',
                      border: `1px solid ${borderColor}`,
                      color: revealed
                        ? isCorrect
                          ? '#10f0a0'
                          : isSelected
                          ? '#ff4d6d'
                          : 'var(--text-secondary)'
                        : isSelected
                        ? '#fff'
                        : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {revealed && isCorrect ? '✓' : revealed && isSelected && !isCorrect && !isDontKnow ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Não sei button — only before answering */}
          {!revealed && (
            <button
              onClick={handleDontKnow}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 12,
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'rgba(255,77,109,0.07)',
                border: '1px solid rgba(255,77,109,0.25)',
                color: 'var(--danger)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginBottom: 12,
                transition: 'all 0.15s',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Não sei — mostrar resposta
            </button>
          )}

          {/* Explanation */}
          {revealed && (
            <div
              style={{
                background: selected === q.correctIndex ? 'rgba(16,240,160,0.08)' : selected === -1 ? 'rgba(99,102,241,0.08)' : 'rgba(255,77,109,0.08)',
                border: `1px solid ${selected === q.correctIndex ? 'rgba(16,240,160,0.25)' : selected === -1 ? 'rgba(99,102,241,0.25)' : 'rgba(255,77,109,0.25)'}`,
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 16,
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: selected === q.correctIndex ? '#10f0a0' : selected === -1 ? 'var(--accent)' : '#ff4d6d',
                  marginRight: 6,
                }}
              >
                {selected === q.correctIndex ? '✓ Correto!' : selected === -1 ? '📖 Resposta correta:' : '✗ Incorreto.'}
              </span>
              {selected === -1 && (
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, marginRight: 6 }}>
                  {q.options[q.correctIndex]} —{' '}
                </span>
              )}
              {q.explanation}
            </div>
          )}

          {revealed && (
            <button
              onClick={handleNext}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px var(--accent-glow)',
              }}
            >
              {qIdx + 1 < total ? 'Continuar →' : 'Ver resultado'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── EnglishPage (main) ────────────────────────────────────────────────────────
export function EnglishPage() {
  const { user } = useAppStore();
  const [screen, setScreen] = useState<Screen>('loading');
  const [progress, setProgress] = useState<UserEnglishProgress | null>(null);
  const [placementResult, setPlacementResult] = useState<PlacementResult | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.name) return;
    loadEnglishProgress(user.name).then((p) => {
      setProgress(p);
      setScreen(p.placementCompleted ? 'study-dashboard' : 'placement-intro');
    });
  }, [user]);

  const handlePlacementComplete = useCallback(
    async (answers: PlacementAnswer[]) => {
      if (!user?.name) return;
      const { level, perSkill } = calculatePlacementLevel(PLACEMENT_QUESTIONS, answers);
      const result: PlacementResult = {
        cefrLevel: level,
        takenAt: new Date().toISOString(),
        perSkillAccuracy: perSkill,
        rawAnswers: answers,
      };
      setPlacementResult(result);
      const updated = await savePlacementResult(user.name, result);
      setProgress(updated);
      setScreen('placement-result');
    },
    [user]
  );

  const handleLessonComplete = useCallback(
    async (score: number) => {
      if (!user?.name || !activeLessonId) return;
      const updated = await completeLessonForUser(user.name, activeLessonId, score, XP_PER_LESSON);
      setProgress(updated);
      setActiveLessonId(null);
      setScreen('study-dashboard');
    },
    [user, activeLessonId]
  );

  const handleRetake = useCallback(async () => {
    if (!user?.name) return;
    const updated = await resetPlacement(user.name);
    setProgress(updated);
    setScreen('placement-intro');
  }, [user]);

  // Vocab / listening / speaking trainers finished — bank XP, refresh, go back.
  const handleToolFinish = useCallback(
    async (xp: number) => {
      if (!user?.name) { setScreen('study-dashboard'); return; }
      if (xp > 0) {
        const updated = await addXpAndStreak(user.name, xp);
        setProgress(updated);
      }
      setScreen('study-dashboard');
    },
    [user]
  );

  const showPageHeader = screen !== 'placement-test' && screen !== 'study-lesson';
  const subTitle: Record<Screen, string> = {
    loading: '',
    'placement-intro': 'Diagnóstico de nível',
    'placement-test': '',
    'placement-result': 'Resultado do diagnóstico',
    'study-dashboard': 'Painel de estudos',
    'study-lesson': '',
    vocab: 'Treino de vocabulário',
    listening: 'Treino de listening',
    speaking: 'Treino de pronúncia',
  };

  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
      {/* Page header */}
      {showPageHeader && screen !== 'loading' && (
        <div
          style={{
            background:
              'linear-gradient(135deg, var(--bg-secondary) 0%, color-mix(in srgb, var(--bg-secondary) 80%, var(--accent)) 100%)',
            borderBottom: '1px solid var(--border-glow)',
            padding: '14px 16px',
          }}
        >
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                flexShrink: 0,
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                boxShadow: '0 0 16px var(--accent-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.2 }}>
                Inglês
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>{subTitle[screen]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Screens */}
      {screen === 'loading' && (
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: '60vh' }}>
          <div
            className="animate-spin"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--accent)',
            }}
          />
        </div>
      )}

      {screen === 'placement-intro' && (
        <PlacementIntro onStart={() => setScreen('placement-test')} isRetake={!!progress?.placement} />
      )}

      {screen === 'placement-test' && <PlacementTest onComplete={handlePlacementComplete} />}

      {screen === 'placement-result' && placementResult && (
        <PlacementResult result={placementResult} onContinue={() => setScreen('study-dashboard')} />
      )}

      {screen === 'study-dashboard' && progress?.currentLevel && (
        <StudyDashboard
          progress={progress}
          onSelectLesson={(id) => {
            setActiveLessonId(id);
            setScreen('study-lesson');
          }}
          onRetake={handleRetake}
          onOpenTool={(tool) => setScreen(tool)}
        />
      )}

      {screen === 'study-lesson' && activeLessonId && (
        <StudyLesson
          lessonId={activeLessonId}
          onComplete={handleLessonComplete}
          onBack={() => {
            setActiveLessonId(null);
            setScreen('study-dashboard');
          }}
        />
      )}

      {screen === 'vocab' && (
        <VocabTrainer userId={user!.name} userLevel={progress?.currentLevel ?? null} onFinish={handleToolFinish} />
      )}
      {screen === 'listening' && (
        <ListeningTrainer userId={user!.name} userLevel={progress?.currentLevel ?? null} onFinish={handleToolFinish} />
      )}
      {screen === 'speaking' && (
        <SpeakingTrainer userId={user!.name} userLevel={progress?.currentLevel ?? null} onFinish={handleToolFinish} />
      )}
    </div>
  );
}
