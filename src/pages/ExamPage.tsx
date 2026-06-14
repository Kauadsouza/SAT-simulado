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
  return (
    <div
      className="fixed bottom-20 right-4 z-40 rounded-xl shadow-2xl overflow-hidden"
      style={{ width: 420, height: 320, background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 text-xs font-semibold"
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}
      >
        <span>Desmos Graphing Calculator</span>
        <button onClick={onClose} className="hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>✕</button>
      </div>
      <iframe
        src="https://www.desmos.com/calculator"
        style={{ width: '100%', height: 280, border: 'none' }}
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-4xl font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Break Time</h2>
      <p className="text-center max-w-sm" style={{ color: 'var(--text-secondary)' }}>
        You've completed the Reading &amp; Writing section. Take a 10-minute break before Math begins.
      </p>
      <button
        onClick={skipBreak}
        className="px-6 py-2.5 rounded-lg font-semibold transition-colors"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Skip Break &rarr; Start Math
      </button>
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

  // Domain breakdown
  const allModules = Object.values(session.modules);
  const domainMap: Record<string, { correct: number; total: number }> = {};
  for (const mod of allModules) {
    if (!mod) continue;
    for (let i = 0; i < mod.questions.length; i++) {
      const q = mod.questions[i];
      const s = mod.states[i];
      const domain = q.domain;
      if (!domainMap[domain]) domainMap[domain] = { correct: 0, total: 0 };
      domainMap[domain].total++;
      if (gradeAnswer(q.type, s.selectedAnswer, q.answer)) domainMap[domain].correct++;
    }
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Test Complete
        </h1>
        <p className="text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
          Here are your results for this practice test.
        </p>

        {/* Score cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Score', value: total, max: 1600, color: 'var(--accent)' },
            { label: 'Reading & Writing', value: rw, max: 800, color: 'var(--success)' },
            { label: 'Math', value: math, max: 800, color: 'var(--warning)' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-5 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {item.label}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                out of {item.max}
              </div>
            </div>
          ))}
        </div>

        {/* Domain breakdown */}
        <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Performance by Domain
          </h3>
          <div className="space-y-3">
            {Object.entries(domainMap).map(([domain, { correct, total: tot }]) => {
              const pct = tot > 0 ? Math.round((correct / tot) * 100) : 0;
              return (
                <div key={domain}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--text-primary)' }}>{DOMAIN_LABELS[domain] ?? domain}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{correct}/{tot} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/historico')}
            className="flex-1 py-3 rounded-xl font-semibold transition-colors"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            View Full History
          </button>
          <button
            onClick={() => navigate('/simulados')}
            className="flex-1 py-3 rounded-xl font-semibold transition-colors"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            New Test
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
        <p style={{ color: 'var(--text-secondary)' }}>No active exam. <button onClick={() => navigate('/simulados')} className="underline" style={{ color: 'var(--accent)' }}>Start one</button>.</p>
      </div>
    );
  }

  if (session.phase === 'break') return <BreakScreen />;
  if (session.phase === 'complete') return <ResultsScreen />;

  if (!question || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading module...</p>
      </div>
    );
  }

  const isSPR = question.type === 'spr';
  const choices = ['A', 'B', 'C', 'D'];
  const isRunning = !!currentModuleId && !['break', 'complete', 'idle'].includes(session.phase);

  // Module info
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
        className="flex items-center justify-between px-4 py-2 shrink-0 z-30"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          minHeight: 52,
        }}
      >
        {/* Left: Section label */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isRW ? 'Reading & Writing' : 'Math'} — Module {currentModuleId?.endsWith('1') ? '1' : '2'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {DOMAIN_LABELS[question.domain]}
          </span>
        </div>

        {/* Center: Timer */}
        <Timer running={isRunning} onExpire={handleExpire} />

        {/* Right: Tools */}
        <div className="flex items-center gap-2">
          {isMath && (
            <>
              <ToolBtn
                icon={<CalcIcon />}
                label="Calculator"
                active={showCalc}
                onClick={() => setShowCalc((v) => !v)}
              />
              <ToolBtn
                icon={<FormulaIcon />}
                label="Reference"
                active={showFormulas}
                onClick={() => setShowFormulas(true)}
              />
            </>
          )}
          <button
            onClick={() => setShowAbandonConfirm(true)}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}
          >
            Exit
          </button>
        </div>
      </header>

      {/* ─── Content Area ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Question number + mark */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Question {currentQuestionIndex + 1} of {totalQ}
            </span>
            <button
              onClick={() => toggleMarkForReview(question.id)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
              style={{
                background: state.markedForReview ? 'color-mix(in srgb, var(--warning) 20%, transparent)' : 'var(--bg-card)',
                border: `1px solid ${state.markedForReview ? 'var(--warning)' : 'var(--border)'}`,
                color: state.markedForReview ? 'var(--warning)' : 'var(--text-secondary)',
              }}
            >
              <BookmarkIcon filled={state.markedForReview} />
              Mark for Review
            </button>
          </div>

          {/* Passage */}
          {question.passage && (
            <div
              className="rounded-xl p-5 mb-5 text-[0.95rem] leading-relaxed"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                lineHeight: 1.8,
              }}
            >
              {isRW ? (
                <TranslatedText
                  text={question.passage}
                  translation={question.translation}
                  showTranslation={showTranslation}
                />
              ) : (
                <MathText text={question.passage} />
              )}
            </div>
          )}

          {/* Prompt */}
          <div className="mb-5 text-[0.95rem]" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {isRW ? (
              <TranslatedText
                text={question.prompt}
                translation={question.translation}
                showTranslation={showTranslation}
              />
            ) : (
              <MathText text={question.prompt} />
            )}
          </div>

          {/* Answer area */}
          {isSPR ? (
            /* Student-Produced Response */
            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Enter your answer in the box below. You may enter decimals or fractions.
              </p>
              <input
                type="text"
                value={state.selectedAnswer ?? ''}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                placeholder="Type your answer..."
                className="w-48 px-4 py-2.5 rounded-xl text-lg font-mono text-center outline-none transition-colors"
                style={{
                  background: 'var(--bg-card)',
                  border: `2px solid ${state.selectedAnswer ? 'var(--accent)' : 'var(--border)'}`,
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          ) : (
            /* Multiple Choice */
            <div className="space-y-3 mb-6">
              {(question.choices ?? []).map((choice, idx) => {
                const letter = choices[idx];
                const isSelected = state.selectedAnswer === letter;
                const isEliminated = state.eliminated[idx];

                return (
                  <div key={idx} className="flex items-start gap-2">
                    {/* Eliminate button */}
                    <button
                      onClick={() => toggleEliminate(question.id, idx)}
                      className="mt-3 p-1 rounded text-xs shrink-0 transition-colors"
                      title="Eliminate this option"
                      style={{
                        color: isEliminated ? 'var(--danger)' : 'var(--text-secondary)',
                        opacity: isEliminated ? 1 : 0.4,
                      }}
                    >
                      <CrossIcon />
                    </button>

                    <button
                      onClick={() => !isEliminated && setAnswer(question.id, letter)}
                      className={`flex-1 flex items-start gap-3 p-4 rounded-xl text-left transition-all ${isEliminated ? 'eliminated' : ''}`}
                      style={{
                        background: isSelected
                          ? 'color-mix(in srgb, var(--accent) 15%, transparent)'
                          : 'var(--bg-card)',
                        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                        color: isEliminated ? 'var(--text-secondary)' : 'var(--text-primary)',
                        cursor: isEliminated ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <span
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background: isSelected ? 'var(--accent)' : 'var(--bg-secondary)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                        }}
                      >
                        {letter}
                      </span>
                      <span className="flex-1 text-[0.95rem] leading-relaxed pt-0.5">
                        {isRW ? (
                          <TranslatedText
                            text={choice}
                            translation={question.translation}
                            showTranslation={showTranslation}
                          />
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
        className="flex items-center justify-between px-4 py-2 shrink-0 z-30"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          minHeight: 52,
        }}
      >
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestion(currentQuestionIndex - 1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          ← Back
        </button>

        {/* Question dots */}
        <button
          onClick={() => setShowNavigator(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <GridIcon />
          Questions {currentQuestionIndex + 1} / {totalQ}
        </button>

        {currentQuestionIndex < totalQ - 1 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestionIndex + 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmitModule}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: 'var(--success)', color: '#fff' }}
          >
            Submit Module ✓
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="rounded-xl p-6 max-w-sm w-full mx-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Exit Test?</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              This will abandon your current test and your progress will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAbandonConfirm(false)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                Keep Testing
              </button>
              <button
                onClick={async () => {
                  const { abandonExam } = useExamStore.getState();
                  await abandonExam();
                  navigate('/simulados');
                }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold"
                style={{ background: 'var(--danger)', color: '#fff' }}
              >
                Exit & Abandon
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
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
      title={label}
      style={{
        background: active ? 'color-mix(in srgb, var(--accent) 20%, transparent)' : 'var(--bg-card)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
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
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
