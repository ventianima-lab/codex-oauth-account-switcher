import type { AccountRecord } from '../core/types';
import type { DashboardPayload } from '../shared/desktopApi';

export type DemoScenario = 'empty' | 'populated' | 'switching';

const baseTimestamp = '2026-04-17T12:00:00.000Z';

function createAccount(
  id: string,
  label: string,
  planType: AccountRecord['planType'],
  primaryRemainingPercent: number,
  secondaryRemainingPercent: number,
  canSwitch = true
): AccountRecord {
  return {
    id,
    label,
    bundlePath: `${id}.bin`,
    authSource: 'codex-auth-file',
    canSwitch,
    switchBlockedReason: canSwitch ? null : '현재 세션으로는 재시작 전환을 지원하지 않습니다.',
    status: 'ready',
    planType,
    usage: {
      fetchedAt: baseTimestamp,
      source: 'fixture',
      primaryRemainingPercent,
      secondaryRemainingPercent,
      primaryResetAt: '2026-04-17T16:30:00.000Z',
      secondaryResetAt: '2026-04-22T23:00:00.000Z'
    },
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp
  };
}

function emptyDashboard(): DashboardPayload {
  return {
    accounts: [],
    state: {
      activeAccountId: null,
      pendingVerificationAccountId: null,
      pendingVerificationSawStop: false,
      lastSwitchAt: null,
      registration: null
    }
  };
}

export function readDemoScenario(search: string): DemoScenario | null {
  const params = new URLSearchParams(search);
  const rawScenario = params.get('demo');

  if (rawScenario === 'populated' || rawScenario === 'switching' || rawScenario === 'empty') {
    return rawScenario;
  }

  return rawScenario === null ? null : 'empty';
}

export function resolveDemoScenario(search: string): DemoScenario {
  return readDemoScenario(search) ?? 'empty';
}

export function getDemoDashboard(scenario: DemoScenario): DashboardPayload {
  if (scenario === 'empty') {
    return emptyDashboard();
  }

  const accounts: AccountRecord[] = [
    createAccount('demo-active', '메인 작업용', 'plus', 48, 70),
    createAccount('demo-backup', '긴급 전환용', 'plus', 23, 65, false),
    createAccount('demo-recommended', '여유 Pro', 'pro-5x', 82, 88)
  ];

  if (scenario === 'switching') {
    return {
      accounts,
      state: {
        activeAccountId: 'demo-active',
        pendingVerificationAccountId: 'demo-recommended',
        pendingVerificationSawStop: true,
        lastSwitchAt: '2026-04-17T12:04:00.000Z',
        registration: null
      }
    };
  }

  return {
    accounts,
    state: {
      activeAccountId: 'demo-active',
      pendingVerificationAccountId: null,
      pendingVerificationSawStop: false,
      lastSwitchAt: null,
      registration: null
    }
  };
}
