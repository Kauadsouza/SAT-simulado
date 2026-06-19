import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { ALL_QUESTIONS } from '../data/index';
import type { Question, Section, Domain, Difficulty } from '../lib/types';
import { DOMAIN_LABELS, skillLabel } from '../lib/constants';
import {
  recordReview,
  getDueReviewItems,
  getReviewStats,
  itemsToQuestions,
  type ReviewStats,
} from '../lib/review_store';
import type { ReviewGrade } from '../lib/srs';
import { gradeAnswer } from '../lib/scoring';
import { MathText } from '../components/MathText';
import { TranslatedText } from '../components/TranslatedText';

// ───────────────────────────────────────────────────────────────────────────────
type View = 'hub' | 'drill' | 'summary';
type DrillKind = 'custom' | 'review' | 'weakness';

interface DrillConfig {
  kind: DrillKind;
  title: string;
}

const SECTIONS: { id: Section; label: string; color: string }[] = [
  { id: 'reading_writing', label: 'Reading & Writing', color: 'var(--cyan)' },
  { id: 'math', label: 'Math', color: 'var(--warning)' },
];

const DIFFS: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Fácil' },
  { id: 'medium', label: 'Médio' },
  { id: 'hard', label: 'Difícil' },
];

const COUNTS = [5, 10, 20];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ['A', 'B', 'C', 'D'];

// ───────────────────────────────────────────────────────────────────────────────
export function PracticePage() {
  const { user } = useAppStore();
  const userId = user?.name ?? '';

  const [view, setView] = useState<View>('hub');
  const [stats, setStats] = useState<ReviewStats | null>(null);

  // drill state
  const [drill, setDrill] = useState<Question[]>([]);
  const [drillConfig, setDrillConfig] = useState<DrillConfig>({ kind: 'custom', title: '' });
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string>('');
  const [revealed, setRevealed] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const refreshStats = useCallback(() => {
    if (!userId) return;
    getReviewStats(userId).then(setStats);
  }, [userId]);

  useEffect(() => { refreshStats(); }, [refreshStats]);

  // ── builder local state ──
  const [section, setSection] = useState<Section>('reading_writing');
  const [pickedDomains, setPickedDomains] = useState<Set<Domain>>(new Set());
  const [pickedDiffs, setPickedDiffs] = useState<Set<Difficulty>>(new Set(['easy', 'medium', 'hard']));
  const [count, setCount] = useState(10);

  const domainsForSection = useMemo(() => {
    const set = new Set<Domain>();
    ALL_QUESTIONS.forEach((q) => { if (q.section === section) set.add(q.domain); });
    return [...set];
  }, [section]);

  const poolSize = useMemo(() => {
    return ALL_QUESTIONS.filter((q) =>
      q.section === section &&
      (pickedDomains.size === 0 || pickedDomains.has(q.domain)) &&
      pickedDiffs.has(q.difficulty)
    ).length;
  }, [section, pickedDomains, pickedDiffs]);

  // ── start drills ──
  function startCustom() {
    const pool = ALL_QUESTIONS.filter((q) =>
      q.section === section &&
      (pickedDomains.size === 0 || pickedDomains.has(q.domain)) &&
      pickedDiffs.has(q.difficulty)
    );
    const qs = shuffle(pool).slice(0, count);
    if (qs.length === 0) return;
    launch(qs, { kind: 'custom', title: SECTIONS.find((s) => s.id === section)!.label });
  }

  async function startReview() {
    const due = await getDueReviewItems(userId);
    const qs = itemsToQuestions(due, ALL_QUESTIONS).slice(0, 20);
    if (qs.length === 0) return;
    launch(qs, { kind: 'review', title: 'Caderno de Erros' });
  }

  async function startWeakness() {
    if (!stats) return;
    const weakSkills = stats.perSkill
      .filter((s) => s.attempts >= 2 && s.accuracy < 75)
      .map((s) => s.key);
    const skillSet = new Set(weakSkills);
    let pool = ALL_QUESTIONS.filter((q) => skillSet.has(q.skill));
    if (pool.length === 0) pool = ALL_QUESTIONS.filter((q) => q.difficulty !== 'easy');
    const qs = shuffle(pool).slice(0, 12);
    if (qs.length === 0) return;
    launch(qs, { kind: 'weakness', title: 'Pontos Fracos' });
  }

  function launch(qs: Question[], config: DrillConfig) {
    setDrill(qs);
    setDrillConfig(config);
    setIdx(0);
    setSelected('');
    setRevealed(false);
    setResults([]);
    setShowTranslation(false);
    setView('drill');
  }

  const current = drill[idx];
  const isRW = current?.section === 'reading_writing';
  const isSPR = current?.type === 'spr';

  function reveal() {
    if (!current) return;
    if (!selected.trim()) return;
    setRevealed(true);
  }

  async function finishQuestion(grade: ReviewGrade) {
    if (!current) return;
    const correct = gradeAnswer(current.type, selected, current.answer);
    await recordReview(userId, current, correct, drillConfig.kind === 'review' ? 'review' : 'drill', grade);
    const nextResults = [...results, correct];
    setResults(nextResults);

    if (idx + 1 >= drill.length) {
      refreshStats();
      setView('summary');
    } else {
      setIdx(idx + 1);
      setSelected('');
      setRevealed(false);
      setShowTranslation(false);
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'drill' && current) {
    const correct = revealed && gradeAnswer(current.type, selected, current.answer);
    const correctLetterIdx = LETTERS.indexOf(current.answer.toUpperCase());

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* progress */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <button onClick={() => { setView('hub'); refreshStats(); }} className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            ← Sair do treino
          </button>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {idx + 1} / {drill.length} · {drillConfig.title}
          </span>
        </div>
        <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--bg-card)' }}>
          <div style={{
            width: `${(idx / drill.length) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width .3s',
          }} />
        </div>

        {/* meta chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-glow)' }}>
            {DOMAIN_LABELS[current.domain]}
          </span>
          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.25)' }}>
            {skillLabel(current.skill)}
          </span>
          {isRW && (
            <button onClick={() => setShowTranslation((v) => !v)}
              className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full ml-auto"
              style={{ background: showTranslation ? 'rgba(16,240,160,0.12)' : 'var(--bg-card)', color: showTranslation ? 'var(--success)' : 'var(--text-secondary)', border: '1px solid var(--border-glow)' }}>
              {showTranslation ? '🇧🇷 Tradução ON' : '🇧🇷 Traduzir'}
            </button>
          )}
        </div>

        {/* passage */}
        {current.passage && (
          <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)', lineHeight: 1.85 }}>
            {isRW
              ? <TranslatedText text={current.passage} translation={current.translation} showTranslation={showTranslation} />
              : <MathText text={current.passage} />}
          </div>
        )}

        {/* prompt */}
        <div className="mb-5 font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isRW
            ? <TranslatedText text={current.prompt} translation={current.translation} showTranslation={showTranslation} />
            : <MathText text={current.prompt} />}
        </div>

        {/* answers */}
        {isSPR ? (
          <input
            type="text"
            value={selected}
            disabled={revealed}
            onChange={(e) => setSelected(e.target.value)}
            placeholder="Sua resposta..."
            className="w-48 px-4 py-2.5 rounded-2xl text-lg font-mono text-center mb-6"
            style={{ background: 'var(--bg-card)', border: `2px solid ${selected ? 'var(--accent)' : 'var(--border-glow)'}`, color: 'var(--text-primary)' }}
          />
        ) : (
          <div className="space-y-3 mb-6">
            {(current.choices ?? []).map((choice, i) => {
              const letter = LETTERS[i];
              const isSel = selected === letter;
              let bg = 'var(--bg-card)';
              let border = isSel ? 'var(--accent)' : 'var(--border-glow)';
              if (revealed) {
                if (i === correctLetterIdx) { bg = 'rgba(16,240,160,0.12)'; border = 'var(--success)'; }
                else if (isSel) { bg = 'rgba(255,77,109,0.12)'; border = 'var(--danger)'; }
              }
              return (
                <button key={i} disabled={revealed} onClick={() => setSelected(letter)}
                  className="w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all"
                  style={{ background: bg, border: `2px solid ${border}`, color: 'var(--text-primary)', cursor: revealed ? 'default' : 'pointer' }}>
                  <span className="font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ background: isSel ? 'var(--accent)' : 'var(--bg-secondary)', color: isSel ? '#fff' : 'var(--text-secondary)' }}>
                    {letter}
                  </span>
                  <span className="flex-1">
                    {isRW
                      ? <TranslatedText text={choice} translation={current.translation} showTranslation={showTranslation} />
                      : <MathText text={choice} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* action / feedback */}
        {!revealed ? (
          <button onClick={reveal} disabled={!selected.trim()}
            className="w-full py-3 rounded-2xl font-bold transition-all"
            style={{ background: selected.trim() ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg-card)', color: selected.trim() ? '#fff' : 'var(--text-secondary)', boxShadow: selected.trim() ? '0 0 20px var(--accent-glow)' : 'none', opacity: selected.trim() ? 1 : 0.6 }}>
            Verificar
          </button>
        ) : (
          <div>
            <div className="rounded-2xl p-4 mb-4"
              style={{ background: correct ? 'rgba(16,240,160,0.08)' : 'rgba(255,77,109,0.08)', border: `1px solid ${correct ? 'rgba(16,240,160,0.3)' : 'rgba(255,77,109,0.3)'}` }}>
              <div className="font-bold mb-1" style={{ color: correct ? 'var(--success)' : 'var(--danger)' }}>
                {correct ? '✓ Correto!' : `✗ Incorreto — resposta certa: ${current.answer}`}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <MathText text={current.explanation} />
              </p>
            </div>

            {correct ? (
              <div>
                <p className="text-xs text-center mb-2" style={{ color: 'var(--text-secondary)' }}>Quão fácil foi? (ajusta quando você revê de novo)</p>
                <div className="grid grid-cols-3 gap-2">
                  <RateBtn label="Difícil" sub="rever logo" color="var(--danger)" onClick={() => finishQuestion('hard')} />
                  <RateBtn label="Bom" sub="normal" color="var(--accent)" onClick={() => finishQuestion('good')} />
                  <RateBtn label="Fácil" sub="rever tarde" color="var(--success)" onClick={() => finishQuestion('easy')} />
                </div>
              </div>
            ) : (
              <button onClick={() => finishQuestion('again')}
                className="w-full py-3 rounded-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', boxShadow: '0 0 20px var(--accent-glow)' }}>
                Próxima →
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'summary') {
    const correctCount = results.filter(Boolean).length;
    const pct = results.length ? Math.round((correctCount / results.length) * 100) : 0;
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Treino concluído!</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Você acertou <strong style={{ color: 'var(--accent)' }}>{correctCount}</strong> de {results.length} ({pct}%).
        </p>
        <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            As questões erradas voltarão em breve no seu <strong style={{ color: 'var(--text-primary)' }}>Caderno de Erros</strong>. As certas foram agendadas para mais longe. Volte amanhã para manter a sequência.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('hub')} className="flex-1 py-3 rounded-2xl font-bold" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}>
            Voltar
          </button>
          <button onClick={() => launch(shuffle(drill), drillConfig)} className="flex-1 py-3 rounded-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>
            Repetir
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════ HUB ════════════
  const weakest = (stats?.perSkill ?? []).filter((s) => s.attempts >= 2).slice(0, 5);
  const dueCount = stats?.dueCount ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Treino</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Pratique por habilidade, revise seus erros com repetição espaçada e ataque seus pontos fracos.
      </p>

      {/* quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button onClick={startReview} disabled={dueCount === 0}
          className="rounded-2xl p-5 text-left transition-all"
          style={{ background: 'var(--bg-card)', border: `1px solid ${dueCount > 0 ? 'rgba(255,77,109,0.4)' : 'var(--border-glow)'}`, opacity: dueCount > 0 ? 1 : 0.6, cursor: dueCount > 0 ? 'pointer' : 'not-allowed' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>🔁 Caderno de Erros</span>
            {dueCount > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--danger)', color: '#fff' }}>{dueCount}</span>}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {dueCount > 0 ? `${dueCount} questões esperando revisão` : 'Nada para revisar agora — faça um treino!'}
          </p>
        </button>

        <button onClick={startWeakness}
          className="rounded-2xl p-5 text-left transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(249,212,35,0.35)' }}>
          <div className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>🎯 Pontos Fracos</div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {weakest.length > 0 ? 'Drill focado nas habilidades que você mais erra' : 'Faça simulados/treinos para mapear seus pontos fracos'}
          </p>
        </button>
      </div>

      {/* stats strip */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Questões vistas" value={stats.total} />
          <Stat label="Dominadas" value={stats.mastered} color="var(--success)" />
          <Stat label="A revisar" value={stats.struggling} color="var(--danger)" />
        </div>
      )}

      {/* weakest skills */}
      {weakest.length > 0 && (
        <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Habilidades mais fracas</h3>
          <div className="space-y-2.5">
            {weakest.map((s) => (
              <div key={s.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{skillLabel(s.key)}</span>
                  <span style={{ color: s.accuracy < 60 ? 'var(--danger)' : s.accuracy < 80 ? 'var(--warning)' : 'var(--success)' }}>{s.accuracy}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div style={{ width: `${s.accuracy}%`, height: '100%', background: s.accuracy < 60 ? 'var(--danger)' : s.accuracy < 80 ? 'var(--warning)' : 'var(--success)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* custom builder */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}>
        <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Treino personalizado</h3>

        {/* section */}
        <div className="flex gap-2 mb-4">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => { setSection(s.id); setPickedDomains(new Set()); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: section === s.id ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)', border: `1px solid ${section === s.id ? 'var(--accent)' : 'var(--border-glow)'}`, color: section === s.id ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* domains */}
        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Domínios (vazio = todos)</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {domainsForSection.map((d) => {
            const on = pickedDomains.has(d);
            return (
              <button key={d} onClick={() => setPickedDomains((prev) => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n; })}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                style={{ background: on ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)', border: `1px solid ${on ? 'var(--accent)' : 'var(--border-glow)'}`, color: on ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {DOMAIN_LABELS[d]}
              </button>
            );
          })}
        </div>

        {/* difficulties */}
        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Dificuldade</p>
        <div className="flex gap-2 mb-4">
          {DIFFS.map((d) => {
            const on = pickedDiffs.has(d.id);
            return (
              <button key={d.id} onClick={() => setPickedDiffs((prev) => { const n = new Set(prev); n.has(d.id) ? n.delete(d.id) : n.add(d.id); if (n.size === 0) return prev; return n; })}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ background: on ? 'rgba(99,102,241,0.12)' : 'var(--bg-secondary)', border: `1px solid ${on ? 'var(--accent)' : 'var(--border-glow)'}`, color: on ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {d.label}
              </button>
            );
          })}
        </div>

        {/* count */}
        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Número de questões</p>
        <div className="flex gap-2 mb-5">
          {COUNTS.map((c) => (
            <button key={c} onClick={() => setCount(c)}
              className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: count === c ? 'rgba(99,102,241,0.12)' : 'var(--bg-secondary)', border: `1px solid ${count === c ? 'var(--accent)' : 'var(--border-glow)'}`, color: count === c ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {c}
            </button>
          ))}
        </div>

        <button onClick={startCustom} disabled={poolSize === 0}
          className="w-full py-3 rounded-2xl font-bold transition-all"
          style={{ background: poolSize > 0 ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg-secondary)', color: poolSize > 0 ? '#fff' : 'var(--text-secondary)', boxShadow: poolSize > 0 ? '0 0 20px var(--accent-glow)' : 'none', opacity: poolSize > 0 ? 1 : 0.6 }}>
          {poolSize > 0 ? `Começar treino (${Math.min(count, poolSize)} questões)` : 'Nenhuma questão com esses filtros'}
        </button>
      </div>
    </div>
  );
}

// ── small components ────────────────────────────────────────────────────────────
function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}>
      <div className="text-2xl font-bold" style={{ color: color ?? 'var(--text-primary)' }}>{value}</div>
      <div className="text-[0.7rem]" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

function RateBtn({ label, sub, color, onClick }: { label: string; sub: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="py-2.5 rounded-2xl font-bold transition-all"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}`, color }}>
      <div className="text-sm">{label}</div>
      <div className="text-[0.6rem] font-normal" style={{ color: 'var(--text-secondary)' }}>{sub}</div>
    </button>
  );
}
