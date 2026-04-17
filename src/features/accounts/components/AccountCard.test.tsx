/* @vitest-environment jsdom */

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AccountCard } from './AccountCard';
import type { AccountRecord } from '../../../core/types';
import type { DesktopState } from '../../../shared/desktopApi';

const account: AccountRecord = {
  id: 'account-1',
  label: 'user@example.com',
  bundlePath: 'account-1.bin',
  canSwitch: true,
  switchBlockedReason: null,
  status: 'ready',
  planType: 'plus',
  usage: {
    fetchedAt: '2026-04-17T01:07:00.000Z',
    source: 'fixture',
    primaryRemainingPercent: 100,
    secondaryRemainingPercent: 84,
    primaryResetAt: '2026-04-17T06:07:00.000Z',
    secondaryResetAt: '2026-04-23T15:59:00.000Z'
  },
  createdAt: '2026-04-17T01:07:00.000Z',
  updatedAt: '2026-04-17T01:07:00.000Z'
};

const state: DesktopState = {
  activeAccountId: null,
  pendingVerificationAccountId: null,
  pendingVerificationSawStop: false,
  lastSwitchAt: null,
  registration: null
};

describe('AccountCard', () => {
  it('shows metrics grouped by quota window before score and timestamp', () => {
    const { container } = render(
      <AccountCard
        account={account}
        state={state}
        recommendedId={account.id}
        onRefresh={vi.fn()}
        onDelete={vi.fn()}
        onSwitch={vi.fn()}
      />
    );

    expect(
      Array.from(container.querySelectorAll('dt')).map((label) => label.textContent?.trim())
    ).toEqual([
      '5시간 남은 양',
      '5시간 초기화',
      '1주 남은 양',
      '1주 초기화',
      '추천 점수',
      '마지막 확인'
    ]);
  });
});
