import { describe, expect, it, vi } from 'vitest';
import { formatResetTimestamp } from './actions';

describe('formatResetTimestamp', () => {
  it('formats a same-day reset as today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-17T01:00:00.000Z'));

    expect(formatResetTimestamp('2026-04-17T05:30:00.000Z')).toBe('오늘 14:30');

    vi.useRealTimers();
  });

  it('formats a next-day reset as tomorrow', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-17T01:00:00.000Z'));

    expect(formatResetTimestamp('2026-04-18T00:00:00.000Z')).toBe('내일 09:00');

    vi.useRealTimers();
  });
});
