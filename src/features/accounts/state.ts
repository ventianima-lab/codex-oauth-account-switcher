import { chooseRecommendedAccount } from '../../core/recommendation';
import type { AccountRecord } from '../../core/types';
import type { DesktopState } from '../../shared/desktopApi';

export function sortAccounts(accounts: AccountRecord[], state: DesktopState): AccountRecord[] {
  const recommended = chooseRecommendedAccount(accounts);

  return [...accounts].sort((left, right) => {
    if (state.pendingVerificationAccountId === left.id) {
      return -1;
    }

    if (state.pendingVerificationAccountId === right.id) {
      return 1;
    }

    if (recommended?.id === left.id) {
      return -1;
    }

    if (recommended?.id === right.id) {
      return 1;
    }

    return left.label.localeCompare(right.label);
  });
}
