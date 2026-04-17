import { describe, expect, it } from 'vitest';
import { normalizePlanType, PLAN_CAPACITY_MULTIPLIER, PLAN_LABELS } from '../planType';

describe('planType', () => {
  it('normalizes the newly expanded personal plan variants', () => {
    expect(normalizePlanType('free')).toBe('free');
    expect(normalizePlanType('go')).toBe('go');
    expect(normalizePlanType('plus')).toBe('plus');
    expect(normalizePlanType('ChatGPT Pro 5x')).toBe('pro-5x');
    expect(normalizePlanType('pro_20x')).toBe('pro-20x');
    expect(normalizePlanType('pro')).toBe('pro');
  });

  it('normalizes business and enterprise seat variants', () => {
    expect(normalizePlanType('team')).toBe('business');
    expect(normalizePlanType('business_codex_seat')).toBe('business-codex');
    expect(normalizePlanType('enterprise')).toBe('enterprise');
    expect(normalizePlanType('enterprise-codex')).toBe('enterprise-codex');
    expect(normalizePlanType('education')).toBe('edu');
  });

  it('keeps official labels and updated recommendation multipliers available', () => {
    expect(PLAN_LABELS['pro-5x']).toBe('프로 5x');
    expect(PLAN_LABELS['pro-20x']).toBe('프로 20x');
    expect(PLAN_CAPACITY_MULTIPLIER['pro-5x']).toBe(10);
    expect(PLAN_CAPACITY_MULTIPLIER['pro-20x']).toBe(20);
    expect(PLAN_CAPACITY_MULTIPLIER['business-codex']).toBe(100);
  });
});
