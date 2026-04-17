import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { CatalogStore } from '../storage';
import type { AccountRecord } from '../types';

const sampleAccount: AccountRecord = {
  id: 'account-1',
  label: 'Primary',
  bundlePath: 'bundles/account-1.bin',
  authSource: 'codex-auth-file',
  canSwitch: true,
  switchBlockedReason: null,
  status: 'ready',
  planType: 'pro',
  usage: {
    fetchedAt: '2026-04-08T00:00:00.000Z',
    source: 'fixture',
    primaryRemainingPercent: 70,
    secondaryRemainingPercent: 44,
    primaryResetAt: '2026-04-08T05:00:00.000Z',
    secondaryResetAt: '2026-04-15T00:00:00.000Z'
  },
  createdAt: '2026-04-08T00:00:00.000Z',
  updatedAt: '2026-04-08T00:00:00.000Z'
};

describe('catalog storage', () => {
  it('round-trips account records', async () => {
    const root = await mkdtemp(join(tmpdir(), 'catalog-test-'));
    const store = new CatalogStore(root);

    await store.save([sampleAccount]);

    await expect(store.load()).resolves.toEqual([sampleAccount]);
  });
});
