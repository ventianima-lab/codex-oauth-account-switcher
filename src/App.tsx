import { useEffect, useMemo, useRef, useState } from 'react';
import type { DashboardPayload } from './shared/desktopApi';
import { SummaryBar } from './features/accounts/components/SummaryBar';
import { AddAccountModal } from './features/accounts/components/AddAccountModal';
import { AccountCard } from './features/accounts/components/AccountCard';
import { chooseRecommendedAccount } from './core/recommendation';
import { sortAccounts } from './features/accounts/state';
import { getRegistrationHelpText } from './features/registration/registerAccountFlow';
import { getDemoDashboard, readDemoScenario } from './demo/demoData';

type AsyncStatus = {
  kind: 'idle' | 'error' | 'success';
  message: string;
};

export default function App() {
  const switchAppliedMessage = '계정 전환이 적용되었습니다.';
  const demoScenario = useMemo(() => readDemoScenario(window.location.search), []);
  const isDemoMode = demoScenario !== null;
  const demoDashboard = useMemo(
    () => (demoScenario ? getDemoDashboard(demoScenario) : null),
    [demoScenario]
  );
  const startupRefreshAttemptedRef = useRef(false);
  const [dashboard, setDashboard] = useState<DashboardPayload>({
    accounts: demoDashboard?.accounts ?? [],
    state:
      demoDashboard?.state ?? {
        activeAccountId: null,
        pendingVerificationAccountId: null,
        pendingVerificationSawStop: false,
        lastSwitchAt: null,
        registration: null
      }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<AsyncStatus>({
    kind: 'idle',
    message: ''
  });

  const recommended = useMemo(
    () => chooseRecommendedAccount(dashboard.accounts),
    [dashboard.accounts]
  );
  const sortedAccounts = useMemo(
    () => sortAccounts(dashboard.accounts, dashboard.state),
    [dashboard.accounts, dashboard.state]
  );

  useEffect(() => {
    if (demoDashboard) {
      setDashboard(demoDashboard);
      return;
    }

    let cancelled = false;

    async function loadDashboardWithStartupRefresh() {
      try {
        const initialDashboard = await window.desktopApi.getDashboard();
        if (cancelled) {
          return;
        }

        setDashboard(initialDashboard);

        if (initialDashboard.accounts.length === 0 || startupRefreshAttemptedRef.current) {
          return;
        }

        startupRefreshAttemptedRef.current = true;
        const refreshedDashboard = await window.desktopApi.refreshAll();

        if (cancelled) {
          return;
        }

        setDashboard(refreshedDashboard);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus({
          kind: 'error',
          message: error instanceof Error ? error.message : '예상하지 못한 오류가 발생했습니다.'
        });
      }
    }

    void loadDashboardWithStartupRefresh();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void window.desktopApi.getDashboard().then(setDashboard).catch(() => {
        // Keep the last visible state unless the user triggers an explicit action.
      });
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isDemoMode]);

  useEffect(() => {
    if (
      status.kind === 'success' &&
      status.message.includes('다시 열면 적용') &&
      dashboard.state.pendingVerificationAccountId === null &&
      status.message !== switchAppliedMessage
    ) {
      setStatus({
        kind: 'success',
        message: switchAppliedMessage
      });
    }
  }, [dashboard.state.pendingVerificationAccountId, status, switchAppliedMessage]);

  const activeAccount = dashboard.accounts.find(
    (account) => account.id === dashboard.state.activeAccountId
  );

  async function runAction(action: () => Promise<DashboardPayload>, successMessage: string) {
    if (isDemoMode) {
      setStatus({
        kind: 'success',
        message: '데모 화면입니다. README용 캡처를 위해 상호작용은 비활성 상태로 유지됩니다.'
      });
      return;
    }

    try {
      const next = await action();
      setDashboard(next);
      setStatus({ kind: 'success', message: successMessage });
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : '예상하지 못한 오류가 발생했습니다.'
      });
    }
  }

  const bannerMessage =
    status.kind === 'idle'
      ? isDemoMode
        ? '공개 저장소용 데모 화면입니다. 실제 계정 정보 없이 기능 흐름만 보여 줍니다.'
        : getRegistrationHelpText(dashboard.state.registration)
      : status.message;

  return (
    <main className="app-shell">
      <SummaryBar
        activeLabel={activeAccount?.label ?? '아직 없음'}
        recommendedLabel={recommended?.label ?? '등록된 계정 없음'}
        recommendedDisabled={!recommended || recommended.id === activeAccount?.id}
        onSwitchRecommended={() =>
          void runAction(
            () => window.desktopApi.switchRecommendedAccount(),
            '추천 계정으로 전환했습니다. Codex를 다시 열면 적용됩니다.'
          )
        }
        onRefreshAll={() =>
          void runAction(
            () => window.desktopApi.refreshAll(),
            '모든 계정의 사용량을 다시 불러왔습니다.'
          )
        }
        onTerminateCodex={() =>
          void runAction(
            () => window.desktopApi.terminateCodex(),
            '코덱스를 종료했습니다. 다시 실행은 직접 해 주세요.'
          )
        }
        onAddAccount={() => setModalOpen(true)}
      />

      <section className={`status-banner ${status.kind}`}>
        <strong>{status.kind === 'error' ? '오류' : '안내'}</strong>
        <span>{bannerMessage}</span>
      </section>

      <section className="card-grid">
        {sortedAccounts.length === 0 ? (
          <div className="empty-state">
            <h2>아직 등록된 계정이 없습니다</h2>
            <p>지금 로그인된 계정을 저장한 뒤, 다른 계정도 로그인 상태에서 같은 방식으로 추가해 보세요.</p>
          </div>
        ) : null}

        {sortedAccounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            state={dashboard.state}
            recommendedId={recommended?.id ?? null}
            onRefresh={() =>
              void runAction(
                () => window.desktopApi.refreshAccount(account.id),
                `${account.label} 계정 사용량을 다시 불러왔습니다.`
              )
            }
            onDelete={() =>
              void runAction(
                () => window.desktopApi.deleteAccount(account.id),
                `${account.label} 계정을 목록에서 삭제했습니다.`
              )
            }
            onSwitch={() =>
              void runAction(
                () => window.desktopApi.switchAccount(account.id),
                `${account.label} 계정으로 전환했습니다. Codex를 다시 열면 적용됩니다.`
              )
            }
          />
        ))}
      </section>

      <AddAccountModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCapture={async (label) => {
          await runAction(
            () => window.desktopApi.captureCurrentAuth({ label }),
            '현재 Codex 인증 상태를 계정으로 저장했습니다.'
          );
          setModalOpen(false);
        }}
      />
    </main>
  );
}
