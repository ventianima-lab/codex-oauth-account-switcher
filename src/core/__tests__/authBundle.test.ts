import { describe, expect, it } from 'vitest';
import {
  createAuthBundleFromBrowserSession,
  getAuthBundleSwitchability,
  isAuthBundleExpired,
  parseAuthBundle
} from '../authBundle';

describe('auth bundle', () => {
  it('builds a codex auth bundle from a browser session payload', () => {
    const encode = (value: object) =>
      Buffer.from(JSON.stringify(value)).toString('base64url');
    const accessToken = [
      encode({ alg: 'HS256', typ: 'JWT' }),
      encode({
        'https://api.openai.com/auth': {
          chatgpt_account_id: 'abc-123',
          chatgpt_plan_type: 'pro'
        },
        email: 'test@example.com'
      }),
      'signature'
    ].join('.');
    const raw = JSON.stringify({
      accessToken
    });

    const bundle = createAuthBundleFromBrowserSession(raw);
    const parsed = parseAuthBundle(bundle);

    expect(parsed.accountId).toBe('abc-123');
    expect(parsed.accessToken).toBe(accessToken);
    expect(parsed.planType).toBe('pro');
    expect(parsed.email).toBe('test@example.com');
  });
});

describe('auth bundle expiry', () => {
  it('detects expired access tokens', () => {
    const encode = (value: object) =>
      Buffer.from(JSON.stringify(value)).toString('base64url');
    const accessToken = [
      encode({ alg: 'HS256', typ: 'JWT' }),
      encode({
        exp: 100,
        'https://api.openai.com/auth': {
          chatgpt_account_id: 'expired-1',
          chatgpt_plan_type: 'plus'
        }
      }),
      'signature'
    ].join('.');
    const bundle = JSON.stringify({
      auth_mode: 'chatgpt',
      tokens: {
        access_token: accessToken,
        account_id: 'expired-1'
      }
    });

    expect(isAuthBundleExpired(bundle, 101000)).toBe(true);
    expect(isAuthBundleExpired(bundle, 99000)).toBe(false);
  });
});

describe('auth bundle switchability', () => {
  it('treats browser-session-derived bundles as non-switchable when refresh credentials are missing', () => {
    const encode = (value: object) =>
      Buffer.from(JSON.stringify(value)).toString('base64url');
    const accessToken = [
      encode({ alg: 'HS256', typ: 'JWT' }),
      encode({
        'https://api.openai.com/auth': {
          chatgpt_account_id: 'session-only',
          chatgpt_plan_type: 'plus'
        }
      }),
      'signature'
    ].join('.');
    const bundle = createAuthBundleFromBrowserSession(JSON.stringify({ accessToken }));

    expect(getAuthBundleSwitchability(bundle)).toEqual({
      canSwitch: false,
      reason:
        '이 계정은 사용량 확인용 세션만 저장돼 있어서 Codex를 다시 열면 인증이 유지되지 않습니다. Codex에서 직접 로그인된 인증을 저장한 계정만 전환할 수 있습니다.'
    });
  });

  it('treats full Codex auth bundles as switchable', () => {
    const bundle = JSON.stringify({
      auth_mode: 'chatgpt',
      last_refresh: '2026-04-09T01:58:52.735293700Z',
      tokens: {
        access_token: 'access',
        refresh_token: 'refresh',
        id_token: 'id',
        account_id: 'account-1'
      }
    });

    expect(getAuthBundleSwitchability(bundle)).toEqual({
      canSwitch: true,
      reason: null
    });
  });
});
