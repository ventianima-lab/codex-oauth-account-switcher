import { describe, expect, it } from 'vitest';
import { getDemoDashboard, readDemoScenario, resolveDemoScenario } from './demoData';

describe('readDemoScenario', () => {
  it('returns null when the page is not in demo mode', () => {
    expect(readDemoScenario('')).toBeNull();
    expect(readDemoScenario('?foo=bar')).toBeNull();
  });

  it('returns the requested supported scenario when demo mode is explicit', () => {
    expect(readDemoScenario('?demo=empty')).toBe('empty');
    expect(readDemoScenario('?demo=populated')).toBe('populated');
    expect(readDemoScenario('?demo=switching')).toBe('switching');
  });

  it('falls back to the public-safe empty scenario for unknown explicit requests', () => {
    expect(readDemoScenario('?demo=secret')).toBe('empty');
  });
});

describe('resolveDemoScenario', () => {
  it('defaults to the empty state when no demo query is present', () => {
    expect(resolveDemoScenario('')).toBe('empty');
    expect(resolveDemoScenario('?foo=bar')).toBe('empty');
  });

  it('accepts supported demo scenarios from the query string', () => {
    expect(resolveDemoScenario('?demo=empty')).toBe('empty');
    expect(resolveDemoScenario('?demo=populated')).toBe('populated');
    expect(resolveDemoScenario('?demo=switching')).toBe('switching');
  });

  it('falls back to the empty state for unknown scenarios', () => {
    expect(resolveDemoScenario('?demo=private-account')).toBe('empty');
  });
});

describe('getDemoDashboard', () => {
  it('returns a blank public-safe dashboard for the empty scenario', () => {
    const dashboard = getDemoDashboard('empty');

    expect(dashboard.accounts).toEqual([]);
    expect(dashboard.state.activeAccountId).toBeNull();
    expect(dashboard.state.pendingVerificationAccountId).toBeNull();
  });

  it('returns multiple public-safe accounts for the populated scenario', () => {
    const dashboard = getDemoDashboard('populated');

    expect(dashboard.accounts).toHaveLength(3);
    expect(dashboard.accounts.map((account) => account.label)).toEqual([
      '메인 작업용',
      '긴급 전환용',
      '여유 Pro'
    ]);
    expect(dashboard.accounts.every((account) => !account.label.includes('@'))).toBe(true);
    expect(dashboard.accounts.every((account) => account.id.startsWith('demo-'))).toBe(true);
  });

  it('marks the switching scenario as pending restart verification', () => {
    const dashboard = getDemoDashboard('switching');

    expect(dashboard.state.activeAccountId).toBe('demo-active');
    expect(dashboard.state.pendingVerificationAccountId).toBe('demo-recommended');
    expect(dashboard.state.pendingVerificationSawStop).toBe(true);
  });
});
