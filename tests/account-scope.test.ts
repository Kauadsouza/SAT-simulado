import { describe, expect, it } from 'vitest';
import { parseAccountScope } from '../src/lib/account-scope';

describe('account storage isolation', () => {
  it('accepts a server-shaped UUID principal', () => {
    expect(parseAccountScope(JSON.stringify({ principal: '123e4567-e89b-42d3-a456-426614174000' })))
      .toBe('123e4567-e89b-42d3-a456-426614174000');
  });

  it('rejects owner, malformed JSON and database-name injection', () => {
    expect(parseAccountScope(JSON.stringify({ principal: 'owner' }))).toBe('');
    expect(parseAccountScope('{')).toBe('');
    expect(parseAccountScope(JSON.stringify({ principal: '../another-account' }))).toBe('');
  });
});
