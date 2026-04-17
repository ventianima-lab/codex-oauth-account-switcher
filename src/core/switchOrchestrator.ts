import { createPendingVerification } from './verification.js';
import type { AccountRecord, AuthAdapter, RestartVerificationStore } from './types.js';

export async function switchAccount(
  account: AccountRecord,
  bundle: string,
  authAdapter: AuthAdapter,
  verificationStore: RestartVerificationStore
): Promise<void> {
  const backupPath = await authAdapter.backupCurrentAuth();

  try {
    await authAdapter.writeBundle(bundle);
    await verificationStore.markPending(createPendingVerification(account.id));
  } catch (error) {
    await authAdapter.restoreBackup(backupPath);
    throw error;
  }
}
