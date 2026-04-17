import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { chooseRecommendedAccount, computeEffectiveRemaining } from '../recommendation';
import type { AccountRecord, PlanType } from '../types';

function createAccount(
  id: string,
  primaryRemaining: number,
  secondaryRemaining: number,
  planType: PlanType = 'plus',
  canSwitch = true
): AccountRecord {
  return {
    id,
    label: id,
    bundlePath: `${id}.bin`,
    canSwitch,
    switchBlockedReason: canSwitch ? null : 'blocked',
    status: 'ready',
    planType,
    usage: {
      fetchedAt: '2026-04-08T00:00:00.000Z',
      source: 'fixture',
      primaryRemainingPercent: primaryRemaining,
      secondaryRemainingPercent: secondaryRemaining,
      primaryResetAt: '2026-04-08T05:00:00.000Z',
      secondaryResetAt: '2026-04-15T00:00:00.000Z'
    },
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z'
  };
}

describe('recommendation', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T00:00:00.000Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('uses the earlier bottleneck between the two quota windows', () => {
    expect(computeEffectiveRemaining(createAccount('a', 100, 1))).toBe(1);
    expect(computeEffectiveRemaining(createAccount('b', 60, 40))).toBe(40);
  });

  it('gives pro accounts a higher recommendation weight for the same remaining percent', () => {
    expect(computeEffectiveRemaining(createAccount('plus', 50, 50, 'plus'))).toBe(50);
    expect(computeEffectiveRemaining(createAccount('pro', 50, 50, 'pro-5x'))).toBe(500);
  });

  it('chooses the account with the highest effective remaining capacity', () => {
    const recommended = chooseRecommendedAccount([
      createAccount('limited-week', 100, 1),
      createAccount('balanced', 60, 40),
      createAccount('better', 70, 55)
    ]);

    expect(recommended?.id).toBe('better');
  });

  it('prefers a pro account when its weighted remaining capacity is actually larger', () => {
    const recommended = chooseRecommendedAccount([
      createAccount('plus-full', 100, 100, 'plus'),
      createAccount('pro-half', 50, 50, 'pro-20x')
    ]);

    expect(recommended?.id).toBe('pro-half');
  });

  it('ignores usage-only accounts when choosing a recommended switch target', () => {
    const recommended = chooseRecommendedAccount([
      createAccount('usage-only', 100, 100, 'pro-20x', false),
      createAccount('switchable', 60, 60, 'plus', true)
    ]);

    expect(recommended?.id).toBe('switchable');
  });

  it('prefers the account that resets sooner when remaining capacity is otherwise the same', () => {
    const recommended = chooseRecommendedAccount([
      createAccount('later-reset', 70, 70),
      {
        ...createAccount('soon-reset', 70, 70),
        usage: {
          ...createAccount('soon-reset', 70, 70).usage!,
          primaryResetAt: '2026-04-08T00:30:00.000Z',
          secondaryResetAt: '2026-04-10T00:00:00.000Z'
        }
      }
    ]);

    expect(recommended?.id).toBe('soon-reset');
  });

  it('still prefers materially larger capacity when reset timing is not enough to close the gap', () => {
    const recommended = chooseRecommendedAccount([
      {
        ...createAccount('tiny-but-soon', 15, 15),
        usage: {
          ...createAccount('tiny-but-soon', 15, 15).usage!,
          primaryResetAt: '2026-04-08T00:10:00.000Z',
          secondaryResetAt: '2026-04-08T03:00:00.000Z'
        }
      },
      createAccount('large-later', 80, 80)
    ]);

    expect(recommended?.id).toBe('large-later');
  });
});
