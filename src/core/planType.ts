import type { PlanType } from './types.js';

export const PLAN_LABELS: Record<PlanType, string> = {
  free: '무료',
  go: 'Go',
  plus: '플러스',
  pro: '프로',
  'pro-5x': '프로 5x',
  'pro-20x': '프로 20x',
  business: '비즈니스',
  'business-codex': '비즈니스 Codex 전용',
  enterprise: '엔터프라이즈',
  'enterprise-codex': '엔터프라이즈 Codex 전용',
  edu: '에듀',
  unknown: '알 수 없음'
};

// Official April 2026 guidance:
// - Plus is the baseline.
// - Pro $100 is 5x higher usage than Plus, with 10x Codex usage for a limited time.
// - Pro $200 is 20x higher usage than Plus.
// For Business / Enterprise / Edu, current help docs describe seat/credit models rather than
// a single personal-plan multiplier, so we keep them neutral unless a Codex-only seat is detected.
export const PLAN_CAPACITY_MULTIPLIER: Record<PlanType, number> = {
  free: 1,
  go: 1,
  plus: 1,
  pro: 10,
  'pro-5x': 10,
  'pro-20x': 20,
  business: 1,
  'business-codex': 100,
  enterprise: 1,
  'enterprise-codex': 100,
  edu: 1,
  unknown: 1
};

export function normalizePlanType(value: string | undefined | null): PlanType {
  if (!value) {
    return 'unknown';
  }

  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return 'unknown';
  }

  if (normalized === 'free') {
    return 'free';
  }

  if (normalized === 'go' || normalized === 'chatgpt_go') {
    return 'go';
  }

  if (normalized === 'plus' || normalized === 'chatgpt_plus') {
    return 'plus';
  }

  if (normalized.includes('enterprise') && normalized.includes('codex')) {
    return 'enterprise-codex';
  }

  if ((normalized.includes('business') || normalized.includes('team')) && normalized.includes('codex')) {
    return 'business-codex';
  }

  if (normalized.includes('enterprise')) {
    return 'enterprise';
  }

  if (normalized.includes('business') || normalized.includes('team')) {
    return 'business';
  }

  if (
    normalized === 'edu' ||
    normalized.includes('education') ||
    normalized.includes('teacher')
  ) {
    return 'edu';
  }

  if (
    normalized.includes('pro 20') ||
    normalized.includes('pro-20') ||
    normalized.includes('pro_20') ||
    normalized.includes('pro20') ||
    normalized.includes('20x')
  ) {
    return 'pro-20x';
  }

  if (
    normalized.includes('pro 5') ||
    normalized.includes('pro-5') ||
    normalized.includes('pro_5') ||
    normalized.includes('pro5') ||
    normalized.includes('5x')
  ) {
    return 'pro-5x';
  }

  if (normalized.includes('pro')) {
    return 'pro';
  }

  return 'unknown';
}
