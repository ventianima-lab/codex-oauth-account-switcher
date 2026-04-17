/* @vitest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SummaryBar } from './SummaryBar';

describe('SummaryBar', () => {
  it('keeps account actions before restart actions', () => {
    render(
      <SummaryBar
        activeLabel="active"
        recommendedLabel="recommended"
        recommendedDisabled={false}
        onSwitchRecommended={vi.fn()}
        onRefreshAll={vi.fn()}
        onTerminateCodex={vi.fn()}
        onAddAccount={vi.fn()}
      />
    );

    expect(
      screen.getAllByRole('button').map((button) => button.textContent?.trim())
    ).toEqual([
      '추천으로 전환',
      '전체 갱신',
      '코덱스 종료',
      '계정 추가',
    ]);
  });
});
