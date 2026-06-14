import Dexie, { type EntityTable } from 'dexie';
import type { ExamSession } from '../lib/types';

interface UserProfile {
  id?: number;
  name: string;
  createdAt: number;
}

const db = new Dexie('SATSimulator') as Dexie & {
  users: EntityTable<UserProfile, 'id'>;
  sessions: EntityTable<ExamSession, 'id'>;
};

db.version(1).stores({
  users: '++id, name',
  sessions: 'id, userId, completedAt, mode, phase',
});

export { db };
export type { UserProfile };
