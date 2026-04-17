import { mkdtemp, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { SessionVault } from '../security/sessionVault';

class ReverseSecretBox {
  encrypt(value: string): string {
    return value.split('').reverse().join('');
  }

  decrypt(value: string): string {
    return value.split('').reverse().join('');
  }
}

describe('session vault', () => {
  it('does not store raw token text on disk', async () => {
    const root = await mkdtemp(join(tmpdir(), 'vault-test-'));
    const vault = new SessionVault(root, new ReverseSecretBox());
    const payload = JSON.stringify({ access_token: 'secret-token' });

    const bundlePath = await vault.save('account-1', payload);
    const stored = await readFile(bundlePath, 'utf8');

    expect(stored).not.toContain('secret-token');
    expect(await vault.load(bundlePath)).toBe(payload);
  });
});
