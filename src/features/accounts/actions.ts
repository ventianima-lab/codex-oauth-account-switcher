import { computeEffectiveRemaining } from '../../core/recommendation';
import type { AccountRecord } from '../../core/types';
import type { DesktopState } from '../../shared/desktopApi';

export function formatRemaining(value: number | null | undefined): string {
  if (typeof value !== 'number') {
    return '알 수 없음';
  }

  return `${value.toFixed(0)}%`;
}

export function formatTimestamp(value: string | null | undefined): string {
  if (!value) {
    return '기록 없음';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '기록 없음';
  }

  const now = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  if (date.getFullYear() === now.getFullYear()) {
    return `${month}/${day} ${hour}:${minute}`;
  }

  const year = String(date.getFullYear()).slice(-2);
  return `${year}/${month}/${day} ${hour}:${minute}`;
}

export function formatResetTimestamp(value: string | null | undefined): string {
  if (!value) {
    return '기록 없음';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '기록 없음';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  if (targetDay.getTime() === today.getTime()) {
    return `오늘 ${hour}:${minute}`;
  }

  if (targetDay.getTime() === tomorrow.getTime()) {
    return `내일 ${hour}:${minute}`;
  }

  return `${date.getMonth() + 1}/${date.getDate()} ${hour}:${minute}`;
}

export function getAccountBadge(account: AccountRecord, state: DesktopState, recommendedId: string | null): string {
  if (account.status === 'expired') {
    return '인증 만료';
  }

  if (account.canSwitch === false) {
    return '사용량 전용';
  }

  if (state.pendingVerificationAccountId === account.id) {
    return '재시작 필요';
  }

  if (state.activeAccountId === account.id) {
    return '활성';
  }

  if (recommendedId === account.id) {
    return '추천';
  }

  if (account.status === 'needs-refresh') {
    return '다시 확인 필요';
  }

  return '준비됨';
}

export function getAccountScore(account: AccountRecord): string {
  return `${computeEffectiveRemaining(account).toFixed(0)}점`;
}
