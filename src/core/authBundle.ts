import type { PlanType } from './types.js';
import { normalizePlanType } from './planType.js';

type RawAuthBundle = {
  auth_mode?: string;
  OPENAI_API_KEY?: string | null;
  last_refresh?: string;
  tokens?: {
    access_token?: string;
    account_id?: string;
    refresh_token?: string;
    id_token?: string;
  };
};

type JwtPayload = {
  email?: string;
  exp?: number;
  'https://api.openai.com/profile'?: {
    email?: string;
  };
  'https://api.openai.com/auth'?: {
    chatgpt_account_id?: string;
    chatgpt_plan_type?: string;
  };
};

type BrowserSessionPayload = {
  accessToken?: string;
  access_token?: string;
  idToken?: string;
  id_token?: string;
  refreshToken?: string;
  refresh_token?: string;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);

  try {
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as JwtPayload;
  } catch {
    return null;
  }
}

function getJwtAccountId(payload: JwtPayload | null): string | null {
  return payload?.['https://api.openai.com/auth']?.chatgpt_account_id ?? null;
}

function getJwtExpiry(payload: JwtPayload | null): string | null {
  if (!payload?.exp) {
    return null;
  }

  return new Date(payload.exp * 1000).toISOString();
}

function hasNonEmptyToken(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function parseAuthBundle(raw: string): {
  accountId: string;
  accessToken: string;
  email: string | null;
  planType: PlanType;
} {
  const bundle = JSON.parse(raw) as RawAuthBundle;
  const accessToken = bundle.tokens?.access_token;
  const accountId = bundle.tokens?.account_id;

  if (!accessToken || !accountId) {
    throw new Error('Current auth bundle is missing required token fields.');
  }

  const payload = decodeJwtPayload(accessToken);

  return {
    accountId,
    accessToken,
    email: payload?.email ?? null,
    planType: normalizePlanType(payload?.['https://api.openai.com/auth']?.chatgpt_plan_type)
  };
}

export function getAuthBundleExpiry(raw: string): string | null {
  const bundle = JSON.parse(raw) as RawAuthBundle;
  const accessToken = bundle.tokens?.access_token;

  if (!accessToken) {
    return null;
  }

  return getJwtExpiry(decodeJwtPayload(accessToken));
}

export function isAuthBundleExpired(raw: string, now = Date.now()): boolean {
  const expiry = getAuthBundleExpiry(raw);
  if (!expiry) {
    return false;
  }

  return new Date(expiry).getTime() <= now;
}

export function getAuthBundleSwitchability(raw: string): {
  canSwitch: boolean;
  reason: string | null;
} {
  const bundle = JSON.parse(raw) as RawAuthBundle;
  const hasRefreshToken = hasNonEmptyToken(bundle.tokens?.refresh_token);
  const hasIdToken = hasNonEmptyToken(bundle.tokens?.id_token);
  const hasLastRefresh =
    typeof bundle.last_refresh === 'string' && bundle.last_refresh.trim().length > 0;

  if (hasRefreshToken && hasIdToken && hasLastRefresh) {
    return {
      canSwitch: true,
      reason: null
    };
  }

  return {
    canSwitch: false,
    reason:
      '이 계정은 사용량 확인용 세션만 저장돼 있어서 Codex를 다시 열면 인증이 유지되지 않습니다. Codex에서 직접 로그인된 인증을 저장한 계정만 전환할 수 있습니다.'
  };
}

export function createAuthBundleFromBrowserSession(raw: string): string {
  const session = JSON.parse(raw) as BrowserSessionPayload;
  const accessToken = session.accessToken ?? session.access_token;

  if (!accessToken) {
    throw new Error('브라우저 세션에서 access token을 찾지 못했습니다.');
  }

  const payload = decodeJwtPayload(accessToken);
  const accountId = getJwtAccountId(payload);

  if (!accountId) {
    throw new Error('브라우저 세션에서 account id를 찾지 못했습니다.');
  }

  const bundle: RawAuthBundle = {
    auth_mode: 'chatgpt',
    OPENAI_API_KEY: null,
    tokens: {
      access_token: accessToken,
      account_id: accountId,
      refresh_token: session.refreshToken ?? session.refresh_token,
      id_token: session.idToken ?? session.id_token
    }
  };

  return JSON.stringify(bundle, null, 2);
}
