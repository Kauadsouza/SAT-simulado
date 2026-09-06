import 'fake-indexeddb/auto';
import { beforeEach, expect, test, vi } from 'vitest';
const backend = vi.hoisted(() => ({ owner: 'owner-a', row: null as null | {payload: Record<string, unknown[]>; revision: number} }));
vi.mock('../src/lib/cloud', () => ({ getStudyCloud: () => ({ owner: backend.owner, client: {
  from: () => ({ select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({data: structuredClone(backend.row),error: null}) }) }) }) }),
  rpc: async (_name: string, args: {p_payload: Record<string, unknown[]>;p_revision: number}) => {
    if ((backend.row?.revision ?? 0) !== args.p_revision) return {data:null,error:{code:'40001'}};
    backend.row = {payload:structuredClone(args.p_payload),revision:args.p_revision+1};
    return {data:backend.row.revision,error:null};
  },
} }) }));
import { db } from '../src/db';
import { studySnapshot, syncStudy } from '../src/lib/study-sync';
import { completeLessonForUser, loadEnglishProgress } from '../src/lib/english_storage';

const storage = new Map<string,string>();
beforeEach(async () => {
  vi.stubGlobal('localStorage', {getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)});
  vi.stubGlobal('navigator', {onLine:true});
  storage.clear(); backend.row=null; backend.owner='owner-a';
  await Promise.all(db.tables.map(table=>table.clear()));
});
test('repeating or failing a completed lesson preserves completion without duplicate XP', async () => {
  await completeLessonForUser('Kauã','lesson-1',0.9,20);
  await completeLessonForUser('Kauã','lesson-1',1,20);
  await completeLessonForUser('Kauã','lesson-1',0.1,20);
  const progress=await loadEnglishProgress('Kauã');
  expect(progress.xp).toBe(20); expect(progress.lessonStatus['lesson-1'].completed).toBe(true); expect(progress.lessonStatus['lesson-1'].bestScore).toBe(1);
});
test('local progress uploads and later changes advance the cloud revision', async () => {
  await completeLessonForUser('Kauã','lesson-1',1,20); await syncStudy('Kauã');
  expect(backend.row?.revision).toBe(1);
  await completeLessonForUser('Kauã','lesson-2',1,30); await syncStudy('Kauã');
  expect(backend.row?.revision).toBe(2);
  expect((backend.row?.payload.englishProgress[0] as {xp:number}).xp).toBe(50);
});
test('an empty new device restores the cloud snapshot', async () => {
  await completeLessonForUser('Kauã','lesson-1',1,20);
  backend.row={payload:await studySnapshot('Kauã'),revision:3}; await db.englishProgress.clear();
  await syncStudy('Kauã'); expect((await loadEnglishProgress('Kauã')).xp).toBe(20); expect(backend.row.revision).toBe(3);
});
test('conflicting changes keep both local and cloud data intact', async () => {
  await completeLessonForUser('Kauã','lesson-1',1,20); await syncStudy('Kauã');
  const cloudBefore=structuredClone(backend.row!); backend.row!.revision++;
  await completeLessonForUser('Kauã','lesson-local',1,10);
  backend.row!.payload.englishProgress = [{...cloudBefore.payload.englishProgress[0] as object,xp:80}];
  await expect(syncStudy('Kauã')).rejects.toThrow('duas cópias');
  expect((await loadEnglishProgress('Kauã')).xp).toBe(30); expect((backend.row!.payload.englishProgress[0] as {xp:number}).xp).toBe(80);
});
test('a local profile never uploads to a different account', async () => {
  await completeLessonForUser('Kauã','lesson-1',1,20); await syncStudy('Kauã'); backend.owner='owner-b';
  await expect(syncStudy('Kauã')).rejects.toThrow('outra conta');
});
