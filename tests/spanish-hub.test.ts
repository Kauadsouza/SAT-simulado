import 'fake-indexeddb/auto';
import { beforeEach, expect, test } from 'vitest';
import { db } from '../src/db';
import { conversationPromptEs, defaultSpanishHub, getSpanishHub, updateSpanishHub } from '../src/lib/spanish-hub';
import { updateLearningHub } from '../src/lib/learning-hub';
import { loadEngineProgress, saveEngineProgress } from '../src/lib/english_engine_storage';
import { SPANISH_QUESTIONS, SPANISH_UNITS, FALSE_FRIENDS, SPANISH_COURSES, SPANISH_ROADMAP } from '../src/data/spanish';

beforeEach(async () => { await Promise.all(db.tables.map(t => t.clear())); });

test('Spanish and English notebooks live in the same record without overwriting each other', async () => {
  await updateLearningHub('learner', s => { s.journal.ingles = 'Keep me'; });
  await updateSpanishHub('learner', s => { s.journal.espanhol = 'Guárdame'; });
  const progress = await loadEngineProgress('learner');
  expect(progress.learningHub?.journal.ingles).toBe('Keep me');
  expect(progress.spanishHub?.journal.espanhol).toBe('Guárdame');
});

test('daily engine writes never drop the Spanish notebook', async () => {
  const stale = await loadEngineProgress('learner');
  await updateSpanishHub('learner', s => { s.journal.simulado = 'Errei os falsos amigos'; });
  stale.intensity = 'lite';
  await saveEngineProgress(stale);
  const progress = await loadEngineProgress('learner');
  expect(progress.intensity).toBe('lite');
  expect(progress.spanishHub?.journal.simulado).toBe('Errei os falsos amigos');
});

test('invalid plan settings fail without modifying persisted progress', async () => {
  await updateSpanishHub('learner', s => { s.journal.saved = 'Guárdame'; });
  await expect(updateSpanishHub('learner', s => { s.settings.minutes = 900; })).rejects.toThrow('configurações');
  const hub = (await loadEngineProgress('learner')).spanishHub;
  expect(hub?.journal.saved).toBe('Guárdame');
  expect(hub?.settings.minutes).toBe(30);
});

test('simulado history keeps only the most recent attempts', async () => {
  await updateSpanishHub('learner', s => {
    s.attempts = Array.from({ length: 60 }, (_, i) => ({ date: '2026-09-15', correct: i % 7, total: 6 }));
  });
  const hub = (await loadEngineProgress('learner')).spanishHub!;
  expect(hub.attempts).toHaveLength(50);
  expect(hub.attempts[49].correct).toBe(59 % 7);
});

test('unknown variants fall back to a supported one and defaults stay valid', () => {
  const broken = { ...defaultSpanishHub(), settings: { ...defaultSpanishHub().settings, variant: 'portunhol' as never } };
  expect(getSpanishHub(broken).settings.variant).toBe('latam');
  expect(getSpanishHub().attempts).toEqual([]);
});

test('conversation prompt adapts to the chosen variant and warns about portunhol', () => {
  const prompt = conversationPromptEs('A2', 'pedir un café', 10, 'espana');
  expect(prompt).toContain('A2');
  expect(prompt).toContain('10 minutos');
  expect(prompt).toContain('pedir un café');
  expect(prompt).toContain('vosotros');
  expect(prompt).toContain('falsos amigos');
  expect(prompt).toContain('APENAS UMA pergunta');
  expect(conversationPromptEs('B1', 'rotina', 5, 'latam')).toContain('ustedes');
});

test('the authored question bank is internally consistent', () => {
  const ids = new Set<string>();
  for (const question of SPANISH_QUESTIONS) {
    expect(ids.has(question.id), `id repetido: ${question.id}`).toBe(false);
    ids.add(question.id);
    expect(question.choices.length).toBeGreaterThanOrEqual(3);
    expect(question.answer).toBeGreaterThanOrEqual(0);
    expect(question.answer).toBeLessThan(question.choices.length);
    expect(new Set(question.choices).size).toBe(question.choices.length);
    expect(question.why.length).toBeGreaterThan(20);
  }
  expect(new Set(SPANISH_QUESTIONS.map(q => q.skill)).size).toBe(4);
});

test('course progress survives alongside notes and attempts', async () => {
  await updateSpanishHub('learner', s => { s.courses['lt-complete'] = { status: 'in_progress', note: 'Aula 12' }; });
  await updateSpanishHub('learner', s => { s.attempts = [{ date: '2026-09-15', correct: 5, total: 6 }]; });
  const hub = (await loadEngineProgress('learner')).spanishHub!;
  expect(hub.courses['lt-complete']).toEqual({ status: 'in_progress', note: 'Aula 12' });
  expect(hub.attempts).toHaveLength(1);
  expect(getSpanishHub({ ...hub, courses: undefined as never }).courses).toEqual({});
});

test('every free course points at a level range the filter understands', () => {
  const levels = ['A1', 'A2', 'B1', 'B2'];
  const ids = new Set<string>();
  for (const course of SPANISH_COURSES) {
    expect(ids.has(course.id), `id repetido: ${course.id}`).toBe(false);
    ids.add(course.id);
    expect(course.url.startsWith('https://'), `${course.id} precisa de https`).toBe(true);
    for (const level of course.level.split('–')) expect(levels, `${course.id} tem nível inválido`).toContain(level);
    expect(course.action.length).toBeGreaterThan(20);
    expect(['peach', 'mint', 'lavender', 'sky']).toContain(course.color);
  }
  expect(SPANISH_ROADMAP.map(step => step.level)).toEqual(levels);
});

test('study material covers the levels offered in the plan', () => {
  expect(SPANISH_UNITS.every(unit => unit.phrases.length >= 3)).toBe(true);
  expect(new Set(SPANISH_UNITS.map(unit => unit.level))).toContain('A1');
  expect(FALSE_FRIENDS.length).toBeGreaterThanOrEqual(8);
  expect(FALSE_FRIENDS.every(item => item.example.trim().length > 0)).toBe(true);
});
