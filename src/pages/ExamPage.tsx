import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import { Timer } from '../components/Timer';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { FormulaSheet } from '../components/FormulaSheet';
import { MathText } from '../components/MathText';
import { TranslatedText } from '../components/TranslatedText';
import { DOMAIN_LABELS } from '../lib/constants';
import { gradeAnswer } from '../lib/scoring';

// ─── Desmos Calculator ────────────────────────────────────────────────────────
function DesmosCalc({ onClose }: { onClose: () => void }) {
  const isMobile = window.innerWidth < 640;
  return (
    <div
      className="fixed z-40 rounded-2xl overflow-hidden"
      style={{
        bottom: isMobile ? 0 : 72,
        left: isMobile ? 0 : 'auto',
        right: isMobile ? 0 : 16,
        width: isMobile ? '100%' : 420,
        height: isMobile ? '60vw' : 330,
        maxHeight: isMobile ? 320 : 330,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
        borderBottomLeftRadius: isMobile ? 0 : undefined,
        borderBottomRightRadius: isMobile ? 0 : undefined,
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 text-xs font-bold"
        style={{
          background: 'linear-gradient(90deg, var(--bg-secondary) 0%, rgba(99,102,241,0.06) 100%)',
          borderBottom: '1px solid var(--border-glow)',
          color: 'var(--accent)',
        }}
      >
        <span>Desmos — Calculadora Gráfica</span>
        <button
          onClick={onClose}
          className="transition-opacity hover:opacity-60"
          style={{ color: 'var(--text-secondary)' }}
        >
          ✕
        </button>
      </div>
      <iframe
        src="https://www.desmos.com/calculator"
        style={{ width: '100%', height: 'calc(100% - 36px)', border: 'none' }}
        title="Desmos Calculator"
      />
    </div>
  );
}

// ─── Break Screen ─────────────────────────────────────────────────────────────
function BreakScreen() {
  const { skipBreak, timeRemainingSec, tickTimer } = useExamStore();

  useEffect(() => {
    const id = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(id);
  }, [tickTimer]);

  const mins = Math.floor(timeRemainingSec / 60);
  const secs = timeRemainingSec % 60;

  useEffect(() => {
    if (timeRemainingSec <= 0) skipBreak();
  }, [timeRemainingSec, skipBreak]);

  const pct = Math.round(((600 - timeRemainingSec) / 600) * 100);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div className="relative text-center">
        <div className="text-5xl mb-3">☕</div>
        <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
          Intervalo
        </h2>
        <p className="text-sm max-w-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Você concluiu a seção de Reading &amp; Writing. Descanse 10 minutos antes de começar Matemática.
        </p>

        <div
          className="text-6xl font-black font-mono mb-6"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 rounded-full mb-6 mx-auto" style={{ background: 'var(--border-glow)' }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--accent) 0%, var(--cyan) 100%)',
            }}
          />
        </div>

        <button
          onClick={skipBreak}
          className="px-8 py-3 rounded-2xl font-bold text-base transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            color: '#fff',
            boxShadow: '0 4px 20px var(--accent-glow)',
          }}
        >
          Pular Intervalo → Iniciar Matemática
        </button>
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen() {
  const { session } = useExamStore();
  const navigate = useNavigate();

  if (!session) return null;

  const rw = session.rwScaled ?? 0;
  const math = session.mathScaled ?? 0;
  const total = session.totalScaled ?? 0;

  const allModules = Object.values(session.modules);
  const domainMap: Record<string, { correct: number; total: number; dontKnow: number }> = {};
  for (const mod of allModules) {
    if (!mod) continue;
    for (let i = 0; i < mod.questions.length; i++) {
      const q = mod.questions[i];
      const s = mod.states[i];
      const domain = q.domain;
      if (!domainMap[domain]) domainMap[domain] = { correct: 0, total: 0, dontKnow: 0 };
      domainMap[domain].total++;
      if (gradeAnswer(q.type, s.selectedAnswer, q.answer)) domainMap[domain].correct++;
      if (s.dontKnow) domainMap[domain].dontKnow++;
    }
  }
  const totalDontKnow = Object.values(domainMap).reduce((a, b) => a + b.dontKnow, 0);

  const scoreColor = total >= 1400 ? 'var(--success)' : total >= 1200 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div
      className="min-h-screen py-10 px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 400, top: 0, left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      <div className="max-w-2xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h1
            className="text-4xl font-black mb-1"
            style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 60%, var(--purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Teste Concluído!
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Veja seu resultado abaixo.
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pontuação Total', value: total, max: 1600, color: scoreColor, glow: `0 0 30px ${scoreColor}44` },
            { label: 'Reading & Writing', value: rw, max: 800, color: 'var(--success)', glow: '0 0 20px rgba(16,240,160,0.2)' },
            { label: 'Math', value: math, max: 800, color: 'var(--warning)', glow: '0 0 20px rgba(249,212,35,0.2)' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-5 text-center"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${item.color}33`,
                boxShadow: item.glow,
              }}
            >
              <div className="text-3xl font-black mb-1" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.label}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                de {item.max}
              </div>
            </div>
          ))}
        </div>

        {/* Domain breakdown */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
        >
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Desempenho por Domínio
          </h3>
          <div className="space-y-3">
            {Object.entries(domainMap).map(([domain, { correct, total: tot, dontKnow }]) => {
              const pct = tot > 0 ? Math.round((correct / tot) * 100) : 0;
              const barColor = pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
              return (
                <div key={domain}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--text-primary)' }}>{DOMAIN_LABELS[domain] ?? domain}</span>
                    <div className="flex items-center gap-2">
                      {dontKnow > 0 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 600 }}>
                          ❓{dontKnow}
                        </span>
                      )}
                      <span style={{ color: 'var(--text-secondary)' }}>{correct}/{tot} ({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--border-glow)' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* "Não sei" analysis — only if user used the feature */}
        {totalDontKnow > 0 && (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{
              background: 'rgba(255,77,109,0.06)',
              border: '1px solid rgba(255,77,109,0.25)',
            }}
          >
            <h3 className="font-bold mb-1" style={{ color: '#ff4d6d' }}>
              ❓ Questões que você não sabia: {totalDontKnow}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12 }}>
              Esses tópicos precisam de mais atenção nos seus estudos.
            </p>
            <div className="space-y-2">
              {Object.entries(domainMap)
                .filter(([, v]) => v.dontKnow > 0)
                .sort((a, b) => b[1].dontKnow - a[1].dontKnow)
                .map(([domain, { dontKnow, total: tot }]) => (
                  <div key={domain} className="flex items-center justify-between">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      {DOMAIN_LABELS[domain] ?? domain}
                    </span>
                    <span style={{
                      fontSize: '0.78rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      background: 'rgba(255,77,109,0.12)', color: '#ff4d6d',
                      border: '1px solid rgba(255,77,109,0.25)',
                    }}>
                      {dontKnow}/{tot}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/historico')}
            className="flex-1 py-3 rounded-2xl font-semibold transition-all hover:opacity-80"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}
          >
            Ver Histórico
          </button>
          <button
            onClick={() => navigate('/simulados')}
            className="flex-1 py-3 rounded-2xl font-bold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              color: '#fff',
              boxShadow: '0 4px 18px var(--accent-glow)',
            }}
          >
            Novo Teste →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Exam Page ───────────────────────────────────────────────────────────
export function ExamPage() {
  const {
    session,
    currentModuleId,
    currentQuestionIndex,
    setCurrentQuestion,
    setAnswer,
    toggleMarkForReview,
    setDontKnow,
    toggleEliminate,
    completeCurrentModule,
    getCurrentModuleQuestions,
    getCurrentModuleStates,
  } = useExamStore();

  const navigate = useNavigate();

  const [showNavigator, setShowNavigator] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  const questions = getCurrentModuleQuestions();
  const states = getCurrentModuleStates();
  const question = questions[currentQuestionIndex];
  const state = states[currentQuestionIndex];

  const showTranslation = session?.mode !== 'hard';
  const isRW = question?.section === 'reading_writing';
  const isMath = question?.section === 'math';

  const handleExpire = useCallback(async () => {
    await completeCurrentModule();
  }, [completeCurrentModule]);

  const handleSubmitModule = useCallback(async () => {
    await completeCurrentModule();
  }, [completeCurrentModule]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Nenhum exame ativo.{' '}
          <button onClick={() => navigate('/simulados')} className="underline" style={{ color: 'var(--accent)' }}>
            Iniciar um
          </button>.
        </p>
      </div>
    );
  }

  if (session.phase === 'break') return <BreakScreen />;
  if (session.phase === 'complete') return <ResultsScreen />;

  if (!question || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Carregando módulo...</p>
      </div>
    );
  }

  const isSPR = question.type === 'spr';
  const choices = ['A', 'B', 'C', 'D'];
  const isRunning = !!currentModuleId && !['break', 'complete', 'idle'].includes(session.phase);

  const moduleData = session.modules[currentModuleId!];
  const totalQ = moduleData?.questions.length ?? 0;

  const navigatorStatuses = questions.map((_, i) => ({
    answered: !!states[i]?.selectedAnswer,
    marked: !!states[i]?.markedForReview,
    current: i === currentQuestionIndex,
  }));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* ─── Top Bar ─────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-3 sm:px-4 shrink-0 z-30"
        style={{
          background: 'linear-gradient(90deg, var(--bg-secondary) 0%, color-mix(in srgb, var(--bg-secondary) 95%, var(--accent)) 100%)',
          borderBottom: '1px solid var(--border-glow)',
          minHeight: 52,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Left: Section label */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-1 h-5 rounded-full shrink-0"
            style={{ background: isRW ? 'var(--cyan)' : 'var(--warning)' }}
          />
          <span className="text-xs sm:text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            <span className="hidden sm:inline">{isRW ? 'Reading & Writing' : 'Math'} — </span>
            <span className="sm:hidden">{isRW ? 'R&W' : 'Math'} </span>
            Mód. {currentModuleId?.endsWith('1') ? '1' : '2'}
          </span>
        </div>

        {/* Center: Timer */}
        <Timer running={isRunning} onExpire={handleExpire} />

        {/* Right: Tools */}
        <div className="flex items-center gap-1 shrink-0">
          {isMath && (
            <>
              <ToolBtn icon={<CalcIcon />} label="Calc" active={showCalc} onClick={() => setShowCalc((v) => !v)} />
              <ToolBtn icon={<FormulaIcon />} label="Fórmulas" active={showFormulas} onClick={() => setShowFormulas(true)} />
            </>
          )}
          <button
            onClick={() => setShowAbandonConfirm(true)}
            className="p-2 rounded-xl transition-colors hover:opacity-80"
            style={{
              color: 'var(--danger)',
              border: '1px solid rgba(255,77,109,0.25)',
              background: 'rgba(255,77,109,0.06)',
            }}
            title="Sair"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ─── Content Area ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Question number + mark + don't know */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--text-secondary)' }}>
              Questão {currentQuestionIndex + 1} de {totalQ}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleMarkForReview(question.id)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all"
                style={{
                  background: state.markedForReview ? 'rgba(249,212,35,0.12)' : 'var(--bg-card)',
                  border: `1px solid ${state.markedForReview ? 'rgba(249,212,35,0.5)' : 'var(--border-glow)'}`,
                  color: state.markedForReview ? 'var(--warning)' : 'var(--text-secondary)',
                  boxShadow: state.markedForReview ? '0 0 10px rgba(249,212,35,0.15)' : 'none',
                }}
              >
                <BookmarkIcon filled={state.markedForReview} />
                <span className="hidden sm:inline">Marcar para Revisão</span>
                <span className="sm:hidden">Revisão</span>
              </button>
              <button
                onClick={() => {
                  setDontKnow(question.id);
                  if (currentQuestionIndex < totalQ - 1) {
                    setCurrentQuestion(currentQuestionIndex + 1);
                  }
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all"
                style={{
                  background: state.dontKnow ? 'rgba(255,77,109,0.12)' : 'var(--bg-card)',
                  border: `1px solid ${state.dontKnow ? 'rgba(255,77,109,0.5)' : 'var(--border-glow)'}`,
                  color: state.dontKnow ? 'var(--danger)' : 'var(--text-secondary)',
                  boxShadow: state.dontKnow ? '0 0 10px rgba(255,77,109,0.15)' : 'none',
                }}
                title="Não sei — pular esta questão"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Não sei
              </button>
            </div>
          </div>

          {/* Passage */}
          {question.passage && (
            <div
              className="rounded-2xl p-5 mb-5 text-[0.95rem] leading-relaxed"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glow)',
                color: 'var(--text-primary)',
                lineHeight: 1.85,
              }}
            >
              {isRW ? (
                <TranslatedText text={question.passage} translation={question.translation} showTranslation={showTranslation} />
              ) : (
                <MathText text={question.passage} />
              )}
            </div>
          )}

          {/* Prompt */}
          <div className="mb-5 text-[0.97rem] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isRW ? (
              <TranslatedText text={question.prompt} translation={question.translation} showTranslation={showTranslation} />
            ) : (
              <MathText text={question.prompt} />
            )}
          </div>

          {/* Answer area */}
          {isSPR ? (
            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Digite sua resposta abaixo. Você pode digitar decimais ou frações.
              </p>
              <input
                type="text"
                value={state.selectedAnswer ?? ''}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                placeholder="Sua resposta..."
                className="w-48 px-4 py-2.5 rounded-2xl text-lg font-mono text-center transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: `2px solid ${state.selectedAnswer ? 'var(--accent)' : 'var(--border-glow)'}`,
                  color: 'var(--text-primary)',
                  boxShadow: state.selectedAnswer ? '0 0 12px var(--accent-glow)' : 'none',
                }}
              />
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {(question.choices ?? []).map((choice, idx) => {
                const letter = choices[idx];
                const isSelected = state.selectedAnswer === letter;
                const isEliminated = state.eliminated[idx];

                return (
                  <div key={idx} className="flex items-start gap-2">
                    <button
                      onClick={() => toggleEliminate(question.id, idx)}
                      className="mt-3.5 p-1 rounded-lg text-xs shrink-0 transition-all"
                      title="Eliminar esta opção"
                      style={{
                        color: isEliminated ? 'var(--danger)' : 'var(--text-secondary)',
                        opacity: isEliminated ? 1 : 0.35,
                        background: isEliminated ? 'rgba(255,77,109,0.1)' : 'transparent',
                      }}
                    >
                      <CrossIcon />
                    </button>

                    <button
                      onClick={() => !isEliminated && setAnswer(question.id, letter)}
                      className={`flex-1 flex items-start gap-3 p-4 rounded-2xl text-left transition-all ${isEliminated ? 'eliminated' : ''}`}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)'
                          : 'var(--bg-card)',
                        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-glow)'}`,
                        color: isEliminated ? 'var(--text-secondary)' : 'var(--text-primary)',
                        cursor: isEliminated ? 'not-allowed' : 'pointer',
                        boxShadow: isSelected ? '0 0 20px var(--accent-glow)' : 'none',
                      }}
                    >
                      <span
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)'
                            : 'var(--bg-secondary)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          border: `1.5px solid ${isSelected ? 'transparent' : 'var(--border-glow)'}`,
                          boxShadow: isSelected ? '0 0 8px var(--accent-glow)' : 'none',
                        }}
                      >
                        {letter}
                      </span>
                      <span className="flex-1 text-[0.95rem] leading-relaxed pt-0.5">
                        {isRW ? (
                          <TranslatedText text={choice} translation={question.translation} showTranslation={showTranslation} />
                        ) : (
                          <MathText text={choice} />
                        )}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ─── Bottom Bar ──────────────────────────────────────────────── */}
      <footer
        className="flex items-center justify-between px-3 sm:px-4 py-2 shrink-0 z-30"
        style={{
          background: 'linear-gradient(90deg, var(--bg-secondary) 0%, color-mix(in srgb, var(--bg-secondary) 95%, var(--accent)) 100%)',
          borderTop: '1px solid var(--border-glow)',
          minHeight: 56,
        }}
      >
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestion(currentQuestionIndex - 1)}
          className="flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-25"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)', minWidth: 44 }}
        >
          <span className="hidden sm:inline">← </span>
          <span className="sm:hidden">‹</span>
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <button
          onClick={() => setShowNavigator(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            color: 'var(--text-secondary)',
          }}
        >
          <GridIcon />
          {currentQuestionIndex + 1} / {totalQ}
        </button>

        {currentQuestionIndex < totalQ - 1 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestionIndex + 1)}
            className="flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              color: '#fff',
              boxShadow: '0 2px 12px var(--accent-glow)',
              minWidth: 44,
            }}
          >
            <span className="hidden sm:inline">Próxima →</span>
            <span className="sm:hidden">›</span>
          </button>
        ) : (
          <button
            onClick={handleSubmitModule}
            className="flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #10f0a0 0%, #06d68a 100%)',
              color: '#000',
              boxShadow: '0 2px 14px rgba(16,240,160,0.3)',
            }}
          >
            <span className="hidden sm:inline">Enviar Módulo ✓</span>
            <span className="sm:hidden">Enviar ✓</span>
          </button>
        )}
      </footer>

      {/* ─── Overlays ────────────────────────────────────────────────── */}
      {showNavigator && (
        <QuestionNavigator
          statuses={navigatorStatuses}
          onNavigate={setCurrentQuestion}
          onClose={() => setShowNavigator(false)}
        />
      )}
      {showFormulas && <FormulaSheet onClose={() => setShowFormulas(false)} />}
      {showCalc && <DesmosCalc onClose={() => setShowCalc(false)} />}

      {/* Abandon confirm */}
      {showAbandonConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(255,77,109,0.25)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
              Sair do Teste?
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              Isso vai abandonar seu teste atual e o progresso será perdido.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAbandonConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}
              >
                Continuar Testando
              </button>
              <button
                onClick={async () => {
                  const { abandonExam } = useExamStore.getState();
                  await abandonExam();
                  navigate('/simulados');
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(255,77,109,0.35)',
                }}
              >
                Sair e Abandonar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────
function ToolBtn({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
      title={label}
      style={{
        background: active ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border-glow)'}`,
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        boxShadow: active ? '0 0 10px var(--accent-glow)' : 'none',
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CalcIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" />
      <rect x="8" y="10" width="2" height="2" /><rect x="11" y="10" width="2" height="2" />
      <rect x="14" y="10" width="2" height="2" /><rect x="8" y="14" width="2" height="2" />
      <rect x="11" y="14" width="2" height="2" /><rect x="14" y="14" width="2" height="2" />
      <rect x="8" y="18" width="2" height="2" /><rect x="14" y="18" width="2" height="2" />
    </svg>
  );
}

function FormulaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19V5a2 2 0 0 1 2-2h14"/><path d="M4 7h4"/><path d="M4 11h6"/><path d="M4 15h8"/>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
