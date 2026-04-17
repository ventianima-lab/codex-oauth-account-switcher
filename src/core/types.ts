export type AccountStatus = 'ready' | 'needs-refresh' | 'switching' | 'error' | 'expired';

export type PlanType =
  | 'free'
  | 'go'
  | 'plus'
  | 'pro'
  | 'pro-5x'
  | 'pro-20x'
  | 'business'
  | 'business-codex'
  | 'enterprise'
  | 'enterprise-codex'
  | 'edu'
  | 'unknown';

export type AccountAuthSource =
  | 'codex-auth-file'
  | 'browser-session'
  | 'login-window'
  | 'session-import';

export type UsageSnapshot = {
  fetchedAt: string;
  source: 'fixture' | 'live';
  primaryRemainingPercent: number;
  secondaryRemainingPercent: number;
  primaryResetAt: string;
  secondaryResetAt: string;
};

export type AccountRecord = {
  id: string;
  label: string;
  bundlePath: string;
  authSource?: AccountAuthSource;
  canSwitch?: boolean;
  switchBlockedReason?: string | null;
  status: AccountStatus;
  planType: PlanType;
  usage: UsageSnapshot | null;
  createdAt: string;
  updatedAt: string;
};

export type SecretBox = {
  encrypt(value: string): string;
  decrypt(value: string): string;
};

export type AuthAdapter = {
  readCurrentAuth(): Promise<string>;
  backupCurrentAuth(): Promise<string>;
  writeBundle(bundle: string): Promise<void>;
  restoreBackup(backupPath: string): Promise<void>;
};

export type RestartVerificationState = {
  accountId: string;
  status: 'pending-restart-verification';
  createdAt: string;
};

export type RestartVerificationStore = {
  markPending(state: RestartVerificationState): Promise<void>;
};
