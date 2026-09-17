# Idiomas

**English** · [Português](README.pt-BR.md) · [Español](README.es.md)

A language-study workspace built for real use, not as a collection of exercises. It covers **English** and **Spanish**, and each language is split into two tracks: **daily study** and **exam preparation**.

[Open the application](https://sat-simulado.vercel.app)

![Study dashboard](english-desktop.png)

---

## Why it exists

Language apps tend to fail in one of two ways: they become an endless list of drills with no direction, or a mock exam that measures without teaching. Here the two live side by side without interfering — the daily plan stays separate from the exam tracks, and progress always belongs to the learner, stored on their own device first.

## English

**Study** — an adjustable daily plan (level, minutes per session, days per week), free courses with progress tracking, reading and vocabulary practice, conversation with a ready-made context for an AI tutor, and spaced repetition to review at the right interval.

**Exams** — dedicated **SAT**, **ACT** and **TOEFL** tracks, plus a digital-SAT-style practice exam: Reading & Writing and Math, with the second module adapting to performance in the first, a timer, question navigation, answer elimination, review flags and a formula sheet.

English also chooses between **British** and **American** variants, and that changes vocabulary, pronunciation and examples — it is not just a label.

## Spanish

**Study** — the same daily plan format, eight free resources selected and checked one by one (Language Transfer, Dreaming Spanish, three from Instituto Cervantes, UT Austin, SpanishDict and Conjuguemos), phrases by level with audio, and a conversation context that instructs the tutor to correct *portuñol* specifically.

**Exams** — an original practice test covering reading comprehension, vocabulary in context, grammar in use and **false friends** — where Portuguese speakers make the most expensive mistakes. Every question explains its answer in Portuguese, and attempt history is saved.

The variant can be **Spain** or **Latin America**, changing pronunciation and vocabulary.

## Engineering decisions worth noting

- **Local first.** All progress lives in the device's IndexedDB and works without an account. Cloud sync is optional and uses the same authenticated session as ARTX Hub — there is no second password.
- **Sync with conflict detection.** Writes use revision comparison, so two tabs or two devices never silently overwrite each other.
- **One record, two languages.** English and Spanish share the same synced record, with tests guaranteeing that saving one never erases the other.
- **The AI credential never reaches the browser.** Content generation goes through a server endpoint; the provider key stays there.
- **Per-account isolation.** Each approved account opens its own local database, with the identifier validated before it becomes a database name.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS, Zustand, Dexie/IndexedDB, Supabase, Vitest, Recharts and KaTeX.

## Local development

```powershell
npm.cmd install
npm.cmd run dev
```

Optional configuration:

| Variable | Purpose |
| --- | --- |
| `LLM_BASE_URL` | OpenAI-compatible endpoint, used server-side |
| `LLM_MODEL` | Model identifier |
| `LLM_API_KEY` | Provider credential — never exposed to the browser |
| `VITE_SUPABASE_URL` | Supabase project URL (optional) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public key for authenticated sync |

Copy `.env.example` to `.env.local`. Never commit real keys.

## Verification

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
npm.cmd audit --omit=dev
```

## Repository map

```text
api/              Content-generation endpoint
src/components/   Shared study and exam interface
src/data/         Content and question banks (English and Spanish)
src/lib/          Storage, sync, scoring and study engines
src/pages/        Study, exam and progress screens
src/store/        User and active-exam state
tests/            Storage, study and regression tests
```

## Academic disclaimer

An independent educational project, not affiliated with College Board, ACT, ETS or Instituto Cervantes. Practice scoring is an approximation and must not be presented as an official score. The Spanish practice test is original and is not yet anchored to any specific official exam.

## Status

In active use. Local mode works without an account; cross-device sync and generated exercises depend on their optional services being configured.

Built and maintained by [Kauã Diniz Souza](https://github.com/Kauadsouza).
