import { describe, expect, it } from 'vitest';
import { getRegistrationHelpText } from './registerAccountFlow';

describe('getRegistrationHelpText', () => {
  it('returns the default help text when no registration is pending', () => {
    expect(getRegistrationHelpText(null)).toBe(
      '지금 로그인된 계정을 바로 저장할 수 있습니다. 다른 계정도 Codex에서 로그인한 뒤 같은 방식으로 추가하세요.'
    );
  });

  it('returns pending Codex login guidance when registration is in progress', () => {
    expect(
      getRegistrationHelpText({
        mode: 'codex-login',
        startedAt: '2026-04-09T12:00:00.000Z'
      })
    ).toBe(
      'Codex에서 로그인한 뒤 Codex를 닫고, 현재 Codex 인증 저장을 누르면 새 계정이 추가됩니다.'
    );
  });
});
