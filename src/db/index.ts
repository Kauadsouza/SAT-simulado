import Dexie, { type EntityTable, type Table } from 'dexie';
import type { ExamSession } from '../lib/types';
import type { UserEnglishProgress } from '../lib/english_types';
import type { ReviewItem } from '../lib/srs';
import type { VocabCard } from '../lib/vocab_store';

interface UserProfile {
  id?: number;
  name: string;
  createdAt: number;
}

const db = new Dexie('SATSimulator') as Dexie & {
  users: EntityTable<UserProfile, 'id'>;
  sessions: EntityTable<ExamSession, 'id'>;
  englishProgress: EntityTable<UserEnglishProgress, 'userId'>;
  // Compound primary key [userId, questionId] — typed as a tuple for .get().
  reviewItems: Table<ReviewItem, [string, string]>;
  // Spaced-repetition cards for English vocabulary. Key [userId, vocabId].
  vocabReview: Table<VocabCard, [string, string]>;
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

// v3 — Spaced-repetition mistake bank. Compound key [userId+questionId] gives
// one card per question per user; [userId+due] powers the "due today" query.
db.version(3).stores({
  users: '++id, name',
  sessions: 'id, userId, completedAt, mode, phase',
  englishProgress: 'userId',
  reviewItems: '[userId+questionId], userId, due, [userId+due], section, skill, domain, lastCorrect',
});

// v4 — English vocabulary SRS deck.
db.version(4).stores({
  users: '++id, name',
  sessions: 'id, userId, completedAt, mode, phase',
  englishProgress: 'userId',
  reviewItems: '[userId+questionId], userId, due, [userId+due], section, skill, domain, lastCorrect',
  vocabReview: '[userId+vocabId], userId, due, [userId+due], level',
});

export { db };
export type { UserProfile };
