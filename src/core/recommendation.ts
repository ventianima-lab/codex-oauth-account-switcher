import type { AccountRecord } from './types.js';
import { PLAN_CAPACITY_MULTIPLIER } from './planType.js';

const RESET_BONUS_WEIGHT = 0.35;
const PRIMARY_WINDOW_HOURS = 5;
const SECONDARY_WINDOW_HOURS = 24 * 7;

function getResetUrgencyMultiplier(
  resetAt: string | null | undefined,
  windowHours: number,
  now = new Date()
): number {
  if (!resetAt) {
    return 1;
  }

  const resetTime = new Date(resetAt);
  if (Number.isNaN(resetTime.getTime())) {
    return 1;
  }

  const hoursUntilReset = Math.max(0, (resetTime.getTime() - now.getTime()) / (1000 * 60 * 60));
  const normalizedRemainingWindow = Math.min(1, hoursUntilReset / windowHours);

  return 1 + (1 - normalizedRemainingWindow) * RESET_BONUS_WEIGHT;
}

export function computeEffectiveRemaining(account: AccountRecord): number {
  if (!account.usage) {
    return 0;
  }

  return (
    Math.min(
      account.usage.primaryRemainingPercent *
        getResetUrgencyMultiplier(account.usage.primaryResetAt, PRIMARY_WINDOW_HOURS),
      account.usage.secondaryRemainingPercent *
        getResetUrgencyMultiplier(account.usage.secondaryResetAt, SECONDARY_WINDOW_HOURS)
    ) * PLAN_CAPACITY_MULTIPLIER[account.planType]
  );
}

export function chooseRecommendedAccount(accounts: AccountRecord[]): AccountRecord | null {
  const eligibleAccounts = accounts.filter(
    (account) => account.status !== 'expired' && account.canSwitch !== false
  );

  if (eligibleAccounts.length === 0) {
    return null;
  }

  return [...eligibleAccounts].sort((left, right) => {
    const remainingDelta = computeEffectiveRemaining(right) - computeEffectiveRemaining(left);

    if (remainingDelta !== 0) {
      return remainingDelta;
    }

    return left.label.localeCompare(right.label);
  })[0] ?? null;
}
