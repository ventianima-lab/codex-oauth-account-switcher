import type { PlanType, UsageSnapshot } from '../types.js';
import { normalizePlanType } from '../planType.js';

export class UsageAuthExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsageAuthExpiredError';
  }
}

type UsageApiResponse = {
  email?: string;
  plan_type?: string;
  rate_limit?: {
    primary_window?: {
      used_percent?: number;
      reset_at?: number;
    };
    secondary_window?: {
      used_percent?: number;
      reset_at?: number;
    };
  };
};

export type UsageFetchResult = {
  email: string | null;
  planType: PlanType;
  usage: UsageSnapshot;
};

function toIso(timestampSeconds: number | undefined): string {
  if (!timestampSeconds) {
    return new Date().toISOString();
  }

  return new Date(timestampSeconds * 1000).toISOString();
}

export async function fetchUsageFromAccessToken(accessToken: string): Promise<UsageFetchResult> {
  const response = await fetch('https://chatgpt.com/backend-api/wham/usage', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'Mozilla/5.0'
    }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new UsageAuthExpiredError(`Usage request failed with status ${response.status}`);
    }

    throw new Error(`Usage request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as UsageApiResponse;
  const primaryUsed = payload.rate_limit?.primary_window?.used_percent ?? 100;
  const secondaryUsed = payload.rate_limit?.secondary_window?.used_percent ?? 100;

  return {
    email: payload.email ?? null,
    planType: normalizePlanType(payload.plan_type),
    usage: {
      fetchedAt: new Date().toISOString(),
      source: 'live',
      primaryRemainingPercent: Math.max(0, 100 - primaryUsed),
      secondaryRemainingPercent: Math.max(0, 100 - secondaryUsed),
      primaryResetAt: toIso(payload.rate_limit?.primary_window?.reset_at),
      secondaryResetAt: toIso(payload.rate_limit?.secondary_window?.reset_at)
    }
  };
}
