import { describe, expect, it } from 'vitest';
import { createPendingVerification } from '../verification';

describe('restart verification', () => {
  it('marks the selected account for restart-time verification', () => {
    const state = createPendingVerification('account-1');

    expect(state.accountId).toBe('account-1');
    expect(state.status).toBe('pending-restart-verification');
  });
});
