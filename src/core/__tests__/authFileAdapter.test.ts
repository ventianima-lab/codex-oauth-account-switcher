import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { AuthFileAdapter } from '../adapters/authFileAdapter';

describe('auth file adapter', () => {
  it('writes a new auth bundle and creates a backup', async () => {
    const root = await mkdtemp(join(tmpdir(), 'auth-file-test-'));
    const authPath = join(root, 'auth.json');
    const backupPath = join(root, 'auth.backup.json');
    await writeFile(authPath, JSON.stringify({ account_id: 'old' }), 'utf8');

    const adapter = new AuthFileAdapter(authPath, backupPath);
    await adapter.writeBundle(JSON.stringify({ account_id: 'new' }));

    await expect(readFile(authPath, 'utf8')).resolves.toContain('"new"');
    await expect(readFile(backupPath, 'utf8')).resolves.toContain('"old"');
  });
});
