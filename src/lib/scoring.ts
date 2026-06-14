import type { Tier } from './types';

// ─── Raw → Scaled conversion tables ─────────────────────────────────────────
// These are approximate curves based on publicly available concordance data.
// The College Board's official equating tables are proprietary; adjust as needed.
//
// Structure: [raw_score] -> scaled_score
// RW: 0–54 raw → 200–800 scaled
// Math: 0–44 raw → 200–800 scaled
//
// Hard-path (mod2 difficult) = full ceiling 800
// Easy-path (mod2 easy) = ceiling ~620 for RW, ~600 for Math

// RW full-path (54 questions, difficult module 2)
const RW_HARD_SCALE: Record<number, number> = {
  0:200,1:200,2:210,3:220,4:230,5:240,6:250,7:260,8:270,9:280,
  10:290,11:300,12:310,13:320,14:330,15:340,16:350,17:360,18:370,19:380,
  20:390,21:400,22:410,23:420,24:430,25:440,26:460,27:480,28:500,29:510,
  30:520,31:530,32:540,33:550,34:560,35:570,36:580,37:590,38:600,39:610,
  40:620,41:630,42:640,43:650,44:660,45:670,46:690,47:710,48:730,49:750,
  50:760,51:770,52:780,53:790,54:800
};

// RW easy-path (54 questions, easy module 2) - ceiling ~620
const RW_EASY_SCALE: Record<number, number> = {
  0:200,1:200,2:210,3:220,4:230,5:240,6:250,7:260,8:270,9:280,
  10:285,11:295,12:305,13:315,14:325,15:335,16:345,17:355,18:365,19:375,
  20:385,21:395,22:405,23:415,24:425,25:435,26:445,27:455,28:465,29:475,
  30:485,31:495,32:505,33:515,34:525,35:535,36:545,37:555,38:565,39:575,
  40:580,41:585,42:590,43:595,44:600,45:605,46:610,47:613,48:616,49:618,
  50:619,51:620,52:620,53:620,54:620
};

// Math full-path (44 questions, difficult module 2)
const MATH_HARD_SCALE: Record<number, number> = {
  0:200,1:200,2:210,3:220,4:230,5:240,6:250,7:265,8:280,9:295,
  10:310,11:320,12:330,13:340,14:350,15:360,16:370,17:380,18:395,19:410,
  20:420,21:430,22:445,23:460,24:470,25:480,26:490,27:505,28:520,29:535,
  30:545,31:555,32:565,33:575,34:585,35:600,36:615,37:630,38:650,39:665,
  40:680,41:710,42:740,43:770,44:800
};

// Math easy-path (44 questions, easy module 2) - ceiling ~600
const MATH_EASY_SCALE: Record<number, number> = {
  0:200,1:200,2:210,3:220,4:230,5:240,6:250,7:260,8:270,9:280,
  10:290,11:300,12:310,13:320,14:330,15:340,16:350,17:360,18:370,19:380,
  20:390,21:400,22:410,23:420,24:430,25:440,26:450,27:460,28:470,29:480,
  30:490,31:500,32:510,33:520,34:530,35:540,36:550,37:560,38:565,39:570,
  40:578,41:585,42:590,43:595,44:600
};

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export function calcRWScaled(rawCorrect: number, usedDifficultMod2: boolean): number {
  const raw = clamp(rawCorrect, 0, 54);
  const table = usedDifficultMod2 ? RW_HARD_SCALE : RW_EASY_SCALE;
  return table[raw] ?? 200;
}

export function calcMathScaled(rawCorrect: number, usedDifficultMod2: boolean): number {
  const raw = clamp(rawCorrect, 0, 44);
  const table = usedDifficultMod2 ? MATH_HARD_SCALE : MATH_EASY_SCALE;
  return table[raw] ?? 200;
}

// Routing threshold: ≥60% in module 1 → difficult module 2
export function isRoutedDifficult(correctCount: number, totalCount: number, _mode: Tier): boolean {
  if (totalCount === 0) return false;
  return (correctCount / totalCount) >= 0.60;
}

// Score an SPR answer: accept equivalent forms
export function gradeSPR(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (s: string) => s.trim().replace(/\s+/g, '').toLowerCase();
  const u = normalize(userAnswer);
  const c = normalize(correctAnswer);
  if (u === c) return true;
  // Numeric equivalence
  const un = parseFloat(u);
  const cn = parseFloat(c);
  if (!isNaN(un) && !isNaN(cn)) return Math.abs(un - cn) < 0.001;
  // Fraction equivalence (e.g. "1/2" == "0.5")
  const fractionMatch = u.match(/^(-?\d+)\/(\d+)$/);
  if (fractionMatch) {
    const frac = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
    return !isNaN(cn) && Math.abs(frac - cn) < 0.001;
  }
  return false;
}

export function gradeAnswer(type: 'multiple_choice' | 'spr', userAnswer: string | null, correctAnswer: string): boolean {
  if (!userAnswer) return false;
  if (type === 'spr') return gradeSPR(userAnswer, correctAnswer);
  return userAnswer.toUpperCase() === correctAnswer.toUpperCase();
}
