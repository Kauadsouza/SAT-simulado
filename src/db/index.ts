import Dexie, { type EntityTable, type Table } from 'dexie';
import type { ExamSession } from '../lib/types';
import type { UserEnglishProgress } from '../lib/english_types';
import type { SrsCard } from '../lib/srs';
import type { EnglishEngineProgress } from '../lib/english_engine_types';
import type { GeneratedContentRecord } from '../lib/llm_types';

interface UserProfile {
  id?: number;
  name: string;
  createdAt: number;
}

const db = new Dexie('SATSimulator') as Dexie & {
  users: EntityTable<UserProfile, 'id'>;
  sessions: EntityTable<ExamSession, 'id'>;
  englishProgress: EntityTable<UserEnglishProgress, 'userId'>;
  srsCards: Table<SrsCard, [string, string]>;
  englishEngine: EntityTable<EnglishEngineProgress, 'userId'>;
  generatedContent: Table<GeneratedContentRecord, [string, string, string]>;
};

db.version(1).stores({
  users: '++id, name',
  sessions: 'id, userId, completedAt, mode, phase',
});

db.version(2).stores({
  users: '++id, name',
  sessions: 'id, userId, completedAt, mode, phase',
  englishProgress: 'userId',
});

db.version(3).stores({
  users: '++id, name',
  sessions: 'id, userId, completedAt, mode, phase',
  englishProgress: 'userId',
  srsCards: '[userId+id], userId, dueDate, [userId+dueDate], cefr',
  englishEngine: 'userId',
});

db.version(4).stores({
  users: '++id, name',
  sessions: 'id, userId, completedAt, mode, phase',
  englishProgress: 'userId',
  srsCards: '[userId+id], userId, dueDate, [userId+dueDate], cefr',
  englishEngine: 'userId',
  generatedContent: '[userId+date+blockId], userId, date',
});

export { db };
export type { UserProfile };
