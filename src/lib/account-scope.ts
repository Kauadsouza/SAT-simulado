/** Accept only the UUID issued by the server; never let arbitrary storage text name a database. */
export function parseAccountScope(raw: string | null) {
  try {
    const account = JSON.parse(raw ?? 'null');
    return typeof account?.principal === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(account.principal)
      ? account.principal
      : '';
  } catch { return ''; }
}

/** Separate browser databases even when different accounts use the same device. */
export function accountScope() {
  return parseAccountScope(typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem('artx-account:study'));
}
