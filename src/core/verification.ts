import type { RestartVerificationState } from './types.js';

export function createPendingVerification(accountId: string): RestartVerificationState {
  return {
    accountId,
    status: 'pending-restart-verification',
    createdAt: new Date().toISOString()
  };
}
