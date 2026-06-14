# SAT Simulator — Digital Adaptive Practice Tests

A full-featured, offline-capable web application for practicing the **Digital SAT** (2024–2026 format). Faithful to the College Board's Bluebook app experience, with adaptive modules, Bluebook-style tools, and Portuguese hover-translation.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Enter your name (default: **Kauã Diniz**) and click Enter.

---

## Features

- **3 difficulty modes**: Easy (with PT translation) · Medium (with PT translation) · Hard (English only)
- **Adaptive multistage testing**: Module 2 difficulty adapts based on Module 1 performance (≥60% → hard module 2)
- **Full SAT structure**: 4 modules: RW-1 → RW-2 → 10-min break → Math-1 → Math-2
- **Bluebook tools**: Mark for Review, Answer Eliminator, Question Navigator, passage highlights
- **Desmos graphing calculator** embedded in Math sections
- **Math formula reference sheet** (all SAT formulas)
- **Portuguese hover-translation** (Easy & Medium modes) — word-by-word tooltips, offline
- **Scoring**: 200–800 per section, 400–1600 total, no wrong-answer penalty, adaptive ceiling
- **Pause/resume between modules** (saved to IndexedDB); cannot pause mid-module
- **Dashboard** with score evolution chart and domain radar (Recharts)
- **Detailed history** per test with question-by-question review and domain breakdown
- **Dark/light theme** (dark by default)
- **IndexedDB persistence** via Dexie.js — per-user, stored locally in the browser
- **Vercel-ready** SPA with rewrite config

---

## Production Build & Deploy

```bash
npm run build       # outputs to dist/
npm run preview     # preview the built app locally
```

### Deploy to Vercel

**Option A — GitHub (recommended):**
1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo
3. Framework preset: **Vite** (auto-detected)
4. Click **Deploy** — the included `vercel.json` handles SPA routing rewrites

**Option B — Vercel CLI:**
```bash
npm install -g vercel
vercel           # follow prompts, links to Vercel project
vercel --prod    # promote to production
```

After deploying, open the Vercel URL, enter your name, and your history will be available locally in that browser.

---

## Project Structure

```
src/
  components/       # Shared UI (Timer, QuestionNavigator, FormulaSheet, MathText, TranslatedText, Layout)
  pages/            # Pages (DashboardPage, SimuladosPage, HistoricoPage, ExamPage, LoginPage)
  store/            # Zustand stores (appStore — user/theme, examStore — active exam)
  data/             # Question bank (questions_rw.ts, questions_math.ts, index.ts)
  lib/              # Types, scoring logic (scoring.ts), constants (constants.ts)
  db/               # Dexie IndexedDB schema (index.ts)
```

---

## Adding Questions to the Bank

Questions live in:
- `src/data/questions_rw.ts` — Reading & Writing
- `src/data/questions_math.ts` — Math

Each question uses this schema:

```ts
{
  id: 'rw-cs-m-099',           // unique ID: section-domain-tier-number
  section: 'reading_writing',  // or 'math'
  domain: 'craft_and_structure',
  skill: 'words_in_context',
  difficulty: 'easy',          // 'easy' | 'medium' | 'hard'
  type: 'multiple_choice',     // or 'spr' (Math only — student-produced response)
  passage: 'Short passage text...',
  prompt: 'Which choice completes the text...?',
  choices: ['Option A', 'Option B', 'Option C', 'Option D'],
  answer: 'A',                 // 'A'|'B'|'C'|'D' for MC; numeric string for SPR
  explanation: 'Why A is correct...',
  translation: {
    words: { 'word': 'tradução' },  // word → PT translation for hover tooltips
    passage_pt: 'Optional full passage PT',
    prompt_pt: 'Optional prompt PT',
  }
}
```

**Domain values:**
- RW: `craft_and_structure` · `information_and_ideas` · `standard_english_conventions` · `expression_of_ideas`
- Math: `algebra` · `advanced_math` · `problem_solving_data_analysis` · `geometry_trigonometry`

After adding questions, save the file — no rebuild needed in dev mode.

---

## Scoring System

Located in `src/lib/scoring.ts`. The raw→scaled lookup tables are **approximate** (College Board's official equating tables are proprietary).

- **RW**: 0–54 raw → 200–800 scaled
- **Math**: 0–44 raw → 200–800 scaled
- **Hard module 2 path**: full ceiling (800 per section)
- **Easy module 2 path**: ceiling ~620 (RW) / ~600 (Math)

Edit the lookup tables in `scoring.ts` to recalibrate from official practice test data.

---

## Persistence Options

**Current (Option A — default):** Data stored in the browser's **IndexedDB**, namespaced per user name. History is device-specific: clearing browser data or switching devices loses history.

**Option B — Supabase (cross-device sync):**
1. Create a free Supabase project at [supabase.com](https://supabase.com)
2. Create tables: `users (name text primary key)` and `sessions (id text primary key, user_name text, data jsonb)`
3. `npm install @supabase/supabase-js`
4. Replace `src/db/index.ts` with Supabase client calls (mirroring the same `get/put/delete` interface)
5. Add environment variables (local `.env` file — never commit to git):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. In Vercel: Project Settings → Environment Variables → add both vars above

---

## Tech Stack

| Library | Purpose |
|---|---|
| React 19 + TypeScript + Vite | SPA framework |
| Tailwind CSS v4 | Styling |
| Zustand | Global state management |
| Dexie.js | IndexedDB persistence |
| Recharts | Score and domain charts |
| KaTeX | Math formula rendering |
| react-router-dom | SPA routing |
| Desmos (iframe) | Graphing calculator in Math sections |
