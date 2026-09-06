import 'fake-indexeddb/auto';
import { beforeEach, expect, test } from 'vitest';
import { db } from '../src/db';
import { defaultLearningHub, updateLearningHub, studyBudget, localDate, conversationPrompt, weeklyActivity } from '../src/lib/learning-hub';
import { loadEngineProgress, saveEngineProgress } from '../src/lib/english_engine_storage';
import { completeLessonForUser, loadEnglishProgress, resetPlacement } from '../src/lib/english_storage';
import { studySnapshot } from '../src/lib/study-sync';

beforeEach(async () => { await Promise.all(db.tables.map(t => t.clear())); });
test('simultaneous note and plan updates preserve each other and isolate profiles', async () => {
  await Promise.all([
    updateLearningHub('learner-a', s => { s.journal.conversation = 'Please say that again.'; }),
    updateLearningHub('learner-a', s => { s.settings.minutes = 15; }),
  ]);
  const saved = (await loadEngineProgress('learner-a')).learningHub!;
  expect(saved.journal.conversation).toBe('Please say that again.');
  expect(saved.settings.minutes).toBe(15);
  expect((await loadEngineProgress('learner-b')).learningHub).toBeUndefined();
});
test('older daily engine writes cannot overwrite newer learning hub notes', async () => {
  const stale = await loadEngineProgress('learner');
  await updateLearningHub('learner', s => { s.courses.voa = { status: 'in_progress', note: 'Lesson 2' }; });
  stale.intensity = 'lite'; await saveEngineProgress(stale);
  const progress = await loadEngineProgress('learner');
  expect(progress.intensity).toBe('lite');
  expect(progress.learningHub?.courses.voa.note).toBe('Lesson 2');
  const snapshot = await studySnapshot('learner');
  expect(snapshot.englishEngine).toHaveLength(1);
  expect(snapshot.englishEngine[0]).toMatchObject({ learningHub: { courses: { voa: { status: 'in_progress' } } } });
});
test('invalid plan settings fail without modifying persisted progress', async () => {
  await updateLearningHub('learner', s => { s.journal.saved = 'Keep me'; });
  await expect(updateLearningHub('learner', s => { s.settings.minutes = 900; })).rejects.toThrow('configurações');
  expect((await loadEngineProgress('learner')).learningHub?.journal.saved).toBe('Keep me');
  expect((await loadEngineProgress('learner')).learningHub?.settings.minutes).toBe(30);
});
test('placement retakes keep completed lessons and earned progress', async () => {
  await completeLessonForUser('learner', 'intro', 1, 20);
  await resetPlacement('learner');
  expect((await loadEnglishProgress('learner')).lessonStatus.intro.completed).toBe(true);
  expect((await loadEnglishProgress('learner')).xp).toBe(20);
});
test('daily budgets, local dates and weekly totals match the chosen schedule', () => {
  for (const minutes of [15, 30, 45, 60]) expect(studyBudget(minutes).reduce((a, b) => a + b)).toBe(minutes);
  const date = new Date(2026, 8, 5, 23, 30);
  expect(localDate(date)).toBe('2026-09-05');
  const state = defaultLearningHub();
  state.days['2026-09-05'] = { done: ['listen'], minutes: 10 };
  expect(weeklyActivity(state, date).map(d => d.minutes)).toEqual([0, 0, 0, 0, 0, 0, 10]);
});
test('conversation prompt adapts to selected context without guaranteeing a level', () => {
  const prompt = conversationPrompt('A1', 'pedir um café', 5);
  expect(prompt).toContain('A1'); expect(prompt).toContain('5 minutos'); expect(prompt).toContain('pedir um café');
  expect(prompt).toContain('APENAS UMA pergunta'); expect(prompt).toContain('Não atribua nota');
});
