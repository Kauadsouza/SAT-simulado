/**
 * Minimal bundled seed for the SRS deck — Phase 1 / Week 1 (A1, "apresentar-se").
 * Proof of concept for the engine; full 26-week content authoring is a later phase.
 */
import type { SrsItemType } from '../lib/srs';
import { newSrsCard } from '../lib/srs';
import { getAllSrsCards, addSrsCards } from '../lib/english_engine_storage';

interface SeedItem {
  id: string;
  type: SrsItemType;
  front: string;
  back: string;
  example: string;
  examplePt: string;
  tags: string[];
}

export const PHASE1_WEEK1_SEED: SeedItem[] = [
  { id: 'p1w1-001', type: 'chunk', front: 'Nice to meet you', back: 'Prazer em te conhecer', example: 'Nice to meet you, I am Kaua.', examplePt: 'Prazer em te conhecer, eu sou o Kaua.', tags: ['greetings'] },
  { id: 'p1w1-002', type: 'chunk', front: "How's it going?", back: 'Como vai?', example: "Hey, how's it going?", examplePt: 'Ei, como vai?', tags: ['greetings'] },
  { id: 'p1w1-003', type: 'chunk', front: "I'm fine, thanks", back: 'Estou bem, obrigado', example: "I'm fine, thanks. And you?", examplePt: 'Estou bem, obrigado. E você?', tags: ['greetings'] },
  { id: 'p1w1-004', type: 'word', front: 'name', back: 'nome', example: 'My name is Nathaly.', examplePt: 'Meu nome é Nathaly.', tags: ['self-intro'] },
  { id: 'p1w1-005', type: 'chunk', front: 'I work as a...', back: 'Eu trabalho como...', example: 'I work as a teacher.', examplePt: 'Eu trabalho como professor.', tags: ['self-intro'] },
  { id: 'p1w1-006', type: 'chunk', front: 'I live in...', back: 'Eu moro em...', example: 'I live in São Paulo.', examplePt: 'Eu moro em São Paulo.', tags: ['self-intro'] },
  { id: 'p1w1-007', type: 'word', front: 'from', back: 'de (origem)', example: "I'm from Brazil.", examplePt: 'Eu sou do Brasil.', tags: ['self-intro'] },
  { id: 'p1w1-008', type: 'chunk', front: 'by the way', back: 'a propósito', example: 'By the way, this is delicious.', examplePt: 'A propósito, isso está delicioso.', tags: ['chunks'] },
  { id: 'p1w1-009', type: 'word', front: 'please', back: 'por favor', example: 'Water, please.', examplePt: 'Água, por favor.', tags: ['survival'] },
  { id: 'p1w1-010', type: 'word', front: 'thank you', back: 'obrigado(a)', example: 'Thank you very much.', examplePt: 'Muito obrigado.', tags: ['survival'] },
  { id: 'p1w1-011', type: 'word', front: 'sorry', back: 'desculpe', example: "Sorry, I'm late.", examplePt: 'Desculpe, estou atrasado.', tags: ['survival'] },
  { id: 'p1w1-012', type: 'chunk', front: 'Excuse me, where is...?', back: 'Com licença, onde está...?', example: 'Excuse me, where is the bathroom?', examplePt: 'Com licença, onde está o banheiro?', tags: ['survival'] },
  { id: 'p1w1-013', type: 'chunk', front: "I'd like...", back: 'Eu gostaria de...', example: "I'd like a coffee, please.", examplePt: 'Eu gostaria de um café, por favor.', tags: ['food'] },
  { id: 'p1w1-014', type: 'word', front: 'water', back: 'água', example: 'Can I have some water?', examplePt: 'Posso ter um pouco de água?', tags: ['food'] },
  { id: 'p1w1-015', type: 'word', front: 'today', back: 'hoje', example: "What's the weather like today?", examplePt: 'Como está o tempo hoje?', tags: ['routine'] },
  { id: 'p1w1-016', type: 'sentence', front: 'What do you do for a living?', back: 'O que você faz da vida (profissão)?', example: 'What do you do for a living? — I am an engineer.', examplePt: 'O que você faz? — Eu sou engenheiro.', tags: ['self-intro'] },
];

export async function seedInitialDeckIfEmpty(userId: string): Promise<void> {
  const existing = await getAllSrsCards(userId);
  if (existing.length > 0) return;
  const now = new Date();
  const cards = PHASE1_WEEK1_SEED.map((item) =>
    newSrsCard(
      {
        id: item.id,
        userId,
        type: item.type,
        front: item.front,
        back: item.back,
        example: item.example,
        examplePt: item.examplePt,
        cefr: 'A1',
        tags: item.tags,
      },
      now,
    ),
  );
  await addSrsCards(cards);
}
