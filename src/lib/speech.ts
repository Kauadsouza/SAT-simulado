/*
 * Web Speech API helpers — 100% free, runs in the browser, no API key.
 *   • Text-to-Speech (SpeechSynthesis): speak English sentences for listening practice.
 *   • Speech-to-Text (SpeechRecognition): capture the user's voice for pronunciation scoring.
 *
 * Speech recognition is Chrome/Edge-only (webkitSpeechRecognition). TTS works almost
 * everywhere. Both are feature-detected so the UI can degrade gracefully.
 */

// ─── Text-to-Speech ─────────────────────────────────────────────────────────────
export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
function loadVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length) cachedVoices = v;
  return cachedVoices;
}
// Some browsers populate voices asynchronously.
if (isTTSSupported()) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => loadVoices();
}

function pickEnglishVoice(): SpeechSynthesisVoice | undefined {
  const voices = loadVoices();
  return (
    voices.find((v) => /en[-_]US/i.test(v.lang) && /google|natural|samantha/i.test(v.name)) ||
    voices.find((v) => /en[-_]US/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang))
  );
}

/** Speak English text. Resolves when finished (or immediately if unsupported). */
export function speak(text: string, rate = 0.95): Promise<void> {
  return new Promise((resolve) => {
    if (!isTTSSupported()) return resolve();
    const synth = window.speechSynthesis;
    synth.cancel(); // stop anything currently speaking
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    const voice = pickEnglishVoice();
    if (voice) u.voice = voice;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    synth.speak(u);
  });
}

export function stopSpeaking(): void {
  if (isTTSSupported()) window.speechSynthesis.cancel();
}

// ─── Speech-to-Text ─────────────────────────────────────────────────────────────
export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export interface RecognitionResult {
  transcript: string;
  confidence: number;
}

/** Record one utterance and return the transcript. Rejects on error/no-speech. */
export function listenOnce(): Promise<RecognitionResult> {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      return reject(new Error('unsupported'));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new Ctor();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    let settled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      settled = true;
      const result = e.results[0][0];
      resolve({ transcript: result.transcript ?? '', confidence: result.confidence ?? 0 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => { if (!settled) reject(new Error(e.error || 'recognition-error')); };
    rec.onend = () => { if (!settled) reject(new Error('no-speech')); };

    try { rec.start(); } catch { reject(new Error('start-failed')); }
  });
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Longest-common-subsequence over word arrays.
 * Returns a boolean[] aligned to `target` marking which target words were matched.
 */
function lcsMatch(target: string[], said: string[]): boolean[] {
  const n = target.length, m = said.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = target[i - 1] === said[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // Backtrack to find which target words are part of the LCS.
  const matched = new Array(n).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (target[i - 1] === said[j - 1]) { matched[i - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return matched;
}

export interface SpeechScore {
  score: number;            // 0–100
  words: { word: string; ok: boolean }[];
  transcript: string;
}

/** Compare what the user said/typed against the target sentence. */
export function scoreSpeech(target: string, spoken: string): SpeechScore {
  const targetWords = normalizeWords(target);
  const saidWords = normalizeWords(spoken);
  const matched = lcsMatch(targetWords, saidWords);
  const hits = matched.filter(Boolean).length;
  const score = targetWords.length ? Math.round((hits / targetWords.length) * 100) : 0;
  // Map back onto the ORIGINAL target tokens (so punctuation/caps show nicely).
  const originalTokens = target.split(/\s+/).filter(Boolean);
  const words = originalTokens.map((tok, idx) => ({ word: tok, ok: matched[idx] ?? false }));
  return { score, words, transcript: spoken };
}
