import { describe, expect, it, vi, beforeEach } from 'vitest';

// O módulo real toca Dexie e o Supabase. Aqui interessa a leitura e a validação
// do arquivo, que é a parte que decide se um backup volta ou não.
vi.mock('../src/db', () => ({ db: { table: () => ({}), transaction: async () => {} } }));
vi.mock('../src/lib/cloud', () => ({ getStudyCloud: () => ({ client: null, owner: null, token: null }) }));

const { parseStudyBackup, planRestore } = await import('../src/lib/study-sync');

const collections = ['sessions', 'englishProgress', 'englishEngine', 'srsCards', 'generatedContent'];

function backup(data: Record<string, unknown[]>, extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    format: 'artx-study-v1',
    profile: 'Kauã',
    exportedAt: '2026-09-18T10:00:00.000Z',
    data,
    ...extra,
  });
}

describe('leitura do arquivo de backup', () => {
  it('aceita um arquivo gerado pelo exportStudy', () => {
    const parsed = parseStudyBackup(backup({ sessions: [{ id: 'a', userId: 'Kauã' }] }));
    expect(parsed.profile).toBe('Kauã');
    expect(parsed.data.sessions).toHaveLength(1);
  });

  it('preenche com lista vazia as coleções ausentes, em vez de quebrar', () => {
    const parsed = parseStudyBackup(backup({ sessions: [] }));
    for (const name of collections) expect(Array.isArray(parsed.data[name])).toBe(true);
  });

  it('recusa arquivo que não é JSON', () => {
    expect(() => parseStudyBackup('isto não é json')).toThrow(/JSON/i);
  });

  it('recusa JSON de outro formato', () => {
    expect(() => parseStudyBackup(JSON.stringify({ format: 'outra-coisa', data: {} }))).toThrow(/backup de estudos/i);
    expect(() => parseStudyBackup(JSON.stringify({ data: {} }))).toThrow(/backup de estudos/i);
  });

  it('recusa arquivo sem dados', () => {
    expect(() => parseStudyBackup(JSON.stringify({ format: 'artx-study-v1' }))).toThrow(/sem dados/i);
  });

  it('recusa coleção que não é lista', () => {
    expect(() => parseStudyBackup(backup({ sessions: { id: 'a' } as unknown as unknown[] }))).toThrow(/deveria ser uma lista/i);
  });

  it('recusa registros corrompidos dentro de uma coleção', () => {
    expect(() => parseStudyBackup(backup({ sessions: [null] }))).toThrow(/corrompidos/i);
    expect(() => parseStudyBackup(backup({ sessions: ['texto solto'] }))).toThrow(/corrompidos/i);
  });

  it('tolera perfil e data ausentes sem recusar o arquivo', () => {
    const parsed = parseStudyBackup(JSON.stringify({ format: 'artx-study-v1', data: { sessions: [] } }));
    expect(parsed.profile).toBe('');
    expect(parsed.exportedAt).toBe('');
  });
});

describe('plano de restauração', () => {
  it('conta o que vem em cada coleção antes de gravar', () => {
    const plan = planRestore(
      backup({
        sessions: [{ id: 'a' }, { id: 'b' }],
        srsCards: [{ id: 'c' }],
        englishEngine: [{ userId: 'Kauã' }],
      }),
    );
    expect(plan.counts.sessions).toBe(2);
    expect(plan.counts.srsCards).toBe(1);
    expect(plan.counts.englishEngine).toBe(1);
    expect(plan.counts.generatedContent).toBe(0);
    expect(plan.total).toBe(4);
  });

  it('um arquivo vazio tem total zero, para a interface poder bloquear', () => {
    expect(planRestore(backup({})).total).toBe(0);
  });

  it('cobre o caderno de espanhol, que vive dentro de englishEngine', () => {
    // Regressão: o espanhol é guardado no campo spanishHub de englishEngine.
    // Se essa coleção ficar de fora do backup, o espanhol some na restauração.
    const plan = planRestore(backup({ englishEngine: [{ userId: 'Kauã', spanishHub: { version: 1 } }] }));
    expect(plan.counts.englishEngine).toBe(1);
    expect((plan.backup.data.englishEngine[0] as Record<string, unknown>).spanishHub).toBeTruthy();
  });
});
