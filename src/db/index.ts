import Dexie, { type EntityTable } from 'dexie';
import type { ExamSession } from '../lib/types';
import type { UserEnglishProgress } from '../lib/english_types';

interface UserProfile {
  id?: number;
  name: string;
  createdAt: number;
}

const db = new Dexie('SATSimulator') as Dexie & {
  users: EntityTable<UserProfile, 'id'>;
  sessions: EntityTable<ExamSession, 'id'>;
  englishProgress: EntityTable<UserEnglishProgress, 'userId'>;
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

export { db };
export type { UserProfile };
