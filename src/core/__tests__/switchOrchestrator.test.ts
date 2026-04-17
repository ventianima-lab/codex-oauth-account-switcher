import { describe, expect, it } from 'vitest';
import { switchAccount } from '../switchOrchestrator';
import type { AccountRecord, AuthAdapter, RestartVerificationStore } from '../types';

const account: AccountRecord = {
  id: 'account-1',
  label: 'Primary',
  bundlePath: 'bundle.bin',
  authSource: 'codex-auth-file',
  canSwitch: true,
  switchBlockedReason: null,
  status: 'ready',
  planType: 'plus',
  usage: {
    fetchedAt: '2026-04-08T00:00:00.000Z',
    source: 'fixture',
    primaryRemainingPercent: 70,
    secondaryRemainingPercent: 60,
    primaryResetAt: '2026-04-08T05:00:00.000Z',
    secondaryResetAt: '2026-04-15T00:00:00.000Z'
  },
  createdAt: '2026-04-08T00:00:00.000Z',
  updatedAt: '2026-04-08T00:00:00.000Z'
};

describe('switch orchestrator', () => {
  it('restores the backup if auth writing fails', async () => {
    let restored = false;
    const authAdapter: AuthAdapter = {
      backupCurrentAuth: async () => 'backup.json',
      readCurrentAuth: async () => JSON.stringify({ account_id: 'old' }),
      writeBundle: async () => {
        throw new Error('write failed');
      },
      restoreBackup: async () => {
        restored = true;
      }
    };

    const verificationStore: RestartVerificationStore = {
      markPending: async () => {
        throw new Error('should not run');
      }
    };

    await expect(switchAccount(account, JSON.stringify({ account_id: 'new' }), authAdapter, verificationStore)).rejects.toThrow('write failed');
    expect(restored).toBe(true);
  });
});
