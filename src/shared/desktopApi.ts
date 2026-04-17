import type { AccountRecord } from '../core/types';
export { PLAN_LABELS } from '../core/planType';

export type DesktopState = {
  activeAccountId: string | null;
  pendingVerificationAccountId: string | null;
  pendingVerificationSawStop: boolean;
  lastSwitchAt: string | null;
  registration: RegistrationState | null;
};

export type RegistrationState = {
  mode: 'codex-login';
  startedAt: string;
};

export type DashboardPayload = {
  accounts: AccountRecord[];
  state: DesktopState;
};

export type CaptureAccountInput = {
  label: string;
};

export type DesktopApi = {
  getDashboard(): Promise<DashboardPayload>;
  refreshAll(): Promise<DashboardPayload>;
  refreshAccount(accountId: string): Promise<DashboardPayload>;
  deleteAccount(accountId: string): Promise<DashboardPayload>;
  captureCurrentAuth(input: CaptureAccountInput): Promise<DashboardPayload>;
  switchAccount(accountId: string): Promise<DashboardPayload>;
  switchRecommendedAccount(): Promise<DashboardPayload>;
  terminateCodex(): Promise<DashboardPayload>;
};
