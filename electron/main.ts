import { execFile } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { AuthFileAdapter } from '../src/core/adapters/authFileAdapter.js';
import {
  fetchUsageFromAccessToken,
  UsageAuthExpiredError
} from '../src/core/adapters/usageProvider.js';
import {
  getAuthBundleSwitchability,
  isAuthBundleExpired,
  parseAuthBundle
} from '../src/core/authBundle.js';
import {
  buildCodexTerminationScript,
  toCodexTerminationErrorMessage
} from '../src/core/codexRestart.js';
import { resolvePreloadPath } from '../src/core/electronPaths.js';
import { chooseRecommendedAccount } from '../src/core/recommendation.js';
import { CatalogStore } from '../src/core/storage.js';
import { createAesSecretBox } from '../src/core/security/createAesSecretBox.js';
import { SessionVault } from '../src/core/security/sessionVault.js';
import { switchAccount } from '../src/core/switchOrchestrator.js';
import { createPendingVerification } from '../src/core/verification.js';
import type { AccountRecord } from '../src/core/types';
import type {
  CaptureAccountInput,
  DashboardPayload,
  DesktopState,
  RegistrationState
} from '../src/shared/desktopApi.js';

const rendererUrl = process.env.ELECTRON_RENDERER_URL;
const demoScenario = process.env.OAUTH_SWITCHER_DEMO_SCENARIO ?? null;
const screenshotOutputPath = process.env.OAUTH_SWITCHER_SCREENSHOT_FILE ?? null;
const autoQuitAfterCapture = process.env.OAUTH_SWITCHER_AUTOCLOSE_AFTER_CAPTURE === 'true';
const dataRoot = path.join(homedir(), '.oauth-account-switcher');
const bundleRoot = path.join(dataRoot, 'bundles');
const registrationRoot = path.join(dataRoot, 'registration');
const registrationStatePath = path.join(registrationRoot, 'pending-codex-login.json');
const registrationOriginalAuthPath = path.join(registrationRoot, 'original-auth.json');
const appStatePath = path.join(dataRoot, 'app-state.json');
const codexAuthPath = path.join(homedir(), '.codex', 'auth.json');
const backupAuthPath = path.join(dataRoot, 'backups', 'auth.json');
const catalogStore = new CatalogStore(dataRoot);
const sessionVault = new SessionVault(bundleRoot, createAesSecretBox());
const authAdapter = new AuthFileAdapter(codexAuthPath, backupAuthPath);
const execFileAsync = promisify(execFile);

type PendingRegistrationSession = {
  mode: 'codex-login';
  startedAt: string;
  originalAuthPath: string | null;
};

type CodexWindowRuntime = {
  isOpen: boolean;
  latestStartTime: string | null;
};

app.disableHardwareAcceleration();

function logLine(...parts: unknown[]) {
  const logDir = path.join(process.cwd(), '.debug');
  mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, 'main.log');
  appendFileSync(logPath, `${new Date().toISOString()} ${parts.map((part) => String(part)).join(' ')}\n`);
}

process.on('uncaughtException', (error) => {
  logLine('uncaught-exception', error.stack ?? error.message);
});

process.on('unhandledRejection', (reason) => {
  logLine(
    'unhandled-rejection',
    reason instanceof Error ? reason.stack ?? reason.message : String(reason)
  );
});

async function ensureDataRoot(): Promise<void> {
  await mkdir(dataRoot, { recursive: true });
  await mkdir(bundleRoot, { recursive: true });
  await mkdir(path.join(dataRoot, 'backups'), { recursive: true });
  await mkdir(registrationRoot, { recursive: true });
}

function toPublicRegistrationState(
  session: PendingRegistrationSession | null
): RegistrationState | null {
  if (!session) {
    return null;
  }

  return {
    mode: session.mode,
    startedAt: session.startedAt
  };
}

async function loadRegistrationSession(): Promise<PendingRegistrationSession | null> {
  try {
    const raw = await readFile(registrationStatePath, 'utf8');
    return JSON.parse(raw) as PendingRegistrationSession;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function clearRegistrationSession(): Promise<void> {
  await rm(registrationStatePath, { force: true });
  await rm(registrationOriginalAuthPath, { force: true });
}

async function restoreOriginalAuth(session: PendingRegistrationSession): Promise<void> {
  if (session.originalAuthPath) {
    const originalAuth = await readFile(session.originalAuthPath, 'utf8');
    await mkdir(path.dirname(codexAuthPath), { recursive: true });
    await writeFile(codexAuthPath, originalAuth, 'utf8');
  } else {
    await rm(codexAuthPath, { force: true });
  }
}

async function loadState(): Promise<DesktopState> {
  try {
    const raw = readFileSync(appStatePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<DesktopState>;
    return {
      activeAccountId: parsed.activeAccountId ?? null,
      pendingVerificationAccountId: parsed.pendingVerificationAccountId ?? null,
      pendingVerificationSawStop: parsed.pendingVerificationSawStop ?? false,
      lastSwitchAt: parsed.lastSwitchAt ?? null,
      registration: parsed.registration ?? null
    };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return {
        activeAccountId: null,
        pendingVerificationAccountId: null,
        pendingVerificationSawStop: false,
        lastSwitchAt: null,
        registration: null
      };
    }

    throw error;
  }
}

async function saveState(state: DesktopState): Promise<void> {
  await writeFile(appStatePath, JSON.stringify(state, null, 2), 'utf8');
}

async function updateRegistrationState(
  session: PendingRegistrationSession | null
): Promise<void> {
  const state = await loadState();
  await saveState({
    ...state,
    registration: toPublicRegistrationState(session)
  });
}

async function getAccounts(): Promise<AccountRecord[]> {
  await ensureDataRoot();
  return catalogStore.load();
}

async function saveAccounts(accounts: AccountRecord[]): Promise<void> {
  await ensureDataRoot();
  await catalogStore.save(accounts);
}

async function getCodexWindowRuntime(): Promise<CodexWindowRuntime> {
  const { stdout } = await execFileAsync('powershell.exe', [
    '-NoProfile',
    '-Command',
    [
      "$windows = @(Get-Process Codex -ErrorAction SilentlyContinue | Where-Object {",
      "  $_.MainWindowHandle -ne 0 -and",
      "  $_.MainWindowTitle -and",
      "  $_.MainWindowTitle.Trim().Length -gt 0",
      "});",
      "if ($windows.Count -gt 0) {",
      "  $latest = $windows | Sort-Object StartTime -Descending | Select-Object -First 1;",
      "  @{ isOpen = $true; latestStartTime = $latest.StartTime.ToUniversalTime().ToString('o') } | ConvertTo-Json -Compress",
      "} else {",
      "  @{ isOpen = $false; latestStartTime = $null } | ConvertTo-Json -Compress",
      "}"
    ].join(' ')
  ]);

  return JSON.parse(stdout.trim()) as CodexWindowRuntime;
}

async function clearStaleRegistrationSession(): Promise<void> {
  const session = await loadRegistrationSession();
  if (!session) {
    return;
  }

  await restoreOriginalAuth(session);
  await clearRegistrationSession();
  await updateRegistrationState(null);
}

async function synchronizeStateWithRuntime(state: DesktopState): Promise<DesktopState> {
  const codexRuntime = await getCodexWindowRuntime();
  const nextState: DesktopState = {
    ...state,
    registration: null
  };

  if (state.pendingVerificationAccountId && !codexRuntime.isOpen) {
    nextState.pendingVerificationSawStop = true;
  }

  try {
    const liveAuth = await authAdapter.readCurrentAuth();
    const parsed = parseAuthBundle(liveAuth);
    nextState.activeAccountId = parsed.accountId;

    const reopenedAfterSwitch =
      !!state.lastSwitchAt &&
      !!codexRuntime.latestStartTime &&
      new Date(codexRuntime.latestStartTime).getTime() > new Date(state.lastSwitchAt).getTime();

    if (
      nextState.pendingVerificationAccountId === parsed.accountId &&
      codexRuntime.isOpen &&
      (nextState.pendingVerificationSawStop || reopenedAfterSwitch)
    ) {
      nextState.pendingVerificationAccountId = null;
      nextState.pendingVerificationSawStop = false;
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      nextState.activeAccountId = null;
    }
  }

  if (!nextState.pendingVerificationAccountId) {
    nextState.pendingVerificationSawStop = false;
  }

  return nextState;
}

async function buildDashboard(): Promise<DashboardPayload> {
  await clearStaleRegistrationSession();
  const accounts = await getAccounts();
  const normalizedAccounts = await Promise.all(
    accounts.map(async (account) => {
      const bundle = await sessionVault.load(account.bundlePath);
      const switchability = getAuthBundleSwitchability(bundle);
      const authSource =
        account.authSource ??
        (switchability.canSwitch ? 'codex-auth-file' : 'session-import');
      if (isAuthBundleExpired(bundle)) {
        return {
          ...account,
          authSource,
          canSwitch: switchability.canSwitch,
          switchBlockedReason: switchability.reason,
          status: 'expired' as const
        };
      }

      return {
        ...account,
        authSource,
        canSwitch: switchability.canSwitch,
        switchBlockedReason: switchability.reason,
        status: account.status === 'expired' ? ('needs-refresh' as const) : account.status
      };
    })
  );
  await saveAccounts(normalizedAccounts);
  const state = await synchronizeStateWithRuntime(await loadState());
  await saveState(state);
  return {
    accounts: normalizedAccounts,
    state
  };
}

async function refreshUsage(account: AccountRecord): Promise<AccountRecord> {
  const bundle = await sessionVault.load(account.bundlePath);
  const switchability = getAuthBundleSwitchability(bundle);
  if (isAuthBundleExpired(bundle)) {
    return {
      ...account,
      canSwitch: switchability.canSwitch,
      switchBlockedReason: switchability.reason,
      status: 'expired',
      updatedAt: new Date().toISOString()
    };
  }

  const parsed = parseAuthBundle(bundle);
  const usage = await fetchUsageFromAccessToken(parsed.accessToken);

  return {
    ...account,
    canSwitch: switchability.canSwitch,
    switchBlockedReason: switchability.reason,
    planType: usage.planType,
    usage: usage.usage,
    status: 'ready',
    updatedAt: new Date().toISOString()
  };
}

async function refreshAccount(accountId: string): Promise<DashboardPayload> {
  const accounts = await getAccounts();
  const nextAccounts = await Promise.all(
    accounts.map(async (account) => {
      if (account.id !== accountId) {
        return account;
      }

      try {
        return await refreshUsage(account);
      } catch (error) {
        if (error instanceof UsageAuthExpiredError) {
          return {
            ...account,
            status: 'expired' as const,
            updatedAt: new Date().toISOString()
          };
        }

        return {
          ...account,
          status: 'needs-refresh' as const,
          updatedAt: new Date().toISOString()
        };
      }
    })
  );

  await saveAccounts(nextAccounts);
  return buildDashboard();
}

async function refreshAll(): Promise<DashboardPayload> {
  const accounts = await getAccounts();
  const nextAccounts = await Promise.all(
    accounts.map(async (account) => {
      try {
        return await refreshUsage(account);
      } catch (error) {
        if (error instanceof UsageAuthExpiredError) {
          return {
            ...account,
            status: 'expired' as const,
            updatedAt: new Date().toISOString()
          };
        }

        return {
          ...account,
          status: 'needs-refresh' as const,
          updatedAt: new Date().toISOString()
        };
      }
    })
  );

  await saveAccounts(nextAccounts);
  return buildDashboard();
}

async function captureCurrentAuth(input: CaptureAccountInput): Promise<DashboardPayload> {
  const accounts = await getAccounts();
  const rawAuth = await authAdapter.readCurrentAuth();

  const switchability = getAuthBundleSwitchability(rawAuth);
  const parsed = parseAuthBundle(rawAuth);
  const existingAccount = accounts.find((account) => account.id === parsed.accountId);

  if (existingAccount) {
    throw new Error(
      `이미 등록된 계정입니다: ${existingAccount.label}. 같은 계정은 다시 추가할 수 없습니다.`
    );
  }

  let usageResult:
    | Awaited<ReturnType<typeof fetchUsageFromAccessToken>>
    | null = null;

  try {
    usageResult = await fetchUsageFromAccessToken(parsed.accessToken);
  } catch {
    usageResult = null;
  }

  const bundlePath = await sessionVault.save(parsed.accountId, rawAuth);
  const nextAccount: AccountRecord = {
    id: parsed.accountId,
    label:
      input.label.trim() || usageResult?.email || parsed.email || parsed.accountId,
    bundlePath,
    authSource: 'codex-auth-file',
    canSwitch: switchability.canSwitch,
    switchBlockedReason: switchability.reason,
    status: usageResult ? 'ready' : 'needs-refresh',
    planType: usageResult?.planType ?? parsed.planType,
    usage: usageResult?.usage ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await saveAccounts([nextAccount, ...accounts]);
  return buildDashboard();
}

async function deleteAccount(accountId: string): Promise<DashboardPayload> {
  const accounts = await getAccounts();
  const target = accounts.find((account) => account.id === accountId);
  if (target) {
    await rm(target.bundlePath, { force: true });
  }

  await saveAccounts(accounts.filter((account) => account.id !== accountId));
  const state = await loadState();
  if (state.activeAccountId === accountId || state.pendingVerificationAccountId === accountId) {
    await saveState({
      ...state,
      activeAccountId: state.activeAccountId === accountId ? null : state.activeAccountId,
      pendingVerificationAccountId:
        state.pendingVerificationAccountId === accountId
          ? null
          : state.pendingVerificationAccountId,
      pendingVerificationSawStop:
        state.pendingVerificationAccountId === accountId
          ? false
          : state.pendingVerificationSawStop
    });
  }

  return buildDashboard();
}

async function switchSelectedAccount(accountId: string): Promise<DashboardPayload> {
  const accounts = await getAccounts();
  const currentState = await loadState();
  const target = accounts.find((account) => account.id === accountId);
  if (!target) {
    throw new Error('Selected account was not found.');
  }

  const bundle = await sessionVault.load(target.bundlePath);
  const switchability = getAuthBundleSwitchability(bundle);
  if (isAuthBundleExpired(bundle)) {
    throw new Error('인증이 만료된 계정입니다. 다시 로그인해서 새로 등록해 주세요.');
  }

  if (target.authSource !== 'codex-auth-file' || !switchability.canSwitch) {
    throw new Error(
      switchability.reason ??
        '이 계정은 아직 Codex 재시작 후 유지되는 전환용 인증이 아닙니다.'
    );
  }

  await switchAccount(target, bundle, authAdapter, {
    markPending: async () => {
      const verificationState = createPendingVerification(accountId);
      await saveState({
        activeAccountId: accountId,
        pendingVerificationAccountId: verificationState.accountId,
        pendingVerificationSawStop: !(await getCodexWindowRuntime()).isOpen,
        lastSwitchAt: verificationState.createdAt,
        registration: currentState.registration
      });
    }
  });

  return buildDashboard();
}

async function switchRecommendedAccount(): Promise<DashboardPayload> {
  const dashboard = await buildDashboard();
  const recommended = chooseRecommendedAccount(dashboard.accounts);

  if (!recommended) {
    throw new Error('전환할 추천 계정이 없습니다.');
  }

  if (dashboard.state.activeAccountId === recommended.id) {
    throw new Error('이미 추천 계정이 활성 상태입니다.');
  }

  return switchSelectedAccount(recommended.id);
}

async function terminateCodex(): Promise<DashboardPayload> {
  try {
    await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-Command',
      buildCodexTerminationScript()
    ]);
  } catch (error) {
    throw new Error(toCodexTerminationErrorMessage(error));
  }

  return buildDashboard();
}

function createMainWindow(): BrowserWindow {
  const preloadPath = resolvePreloadPath(app.getAppPath());
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1080,
    minHeight: 760,
    title: 'Codex 계정 전환기',
    backgroundColor: '#f4f1ea',
    autoHideMenuBar: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  window.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedUrl) => {
    logLine('did-fail-load', JSON.stringify({ errorCode, errorDescription, validatedUrl }));
  });

  window.webContents.on('did-finish-load', () => {
    logLine('did-finish-load', window.webContents.getURL());
    setTimeout(() => {
      void window.webContents.capturePage().then((image) => {
        const shotPath =
          screenshotOutputPath ?? path.join(process.cwd(), '.debug', 'renderer-capture.png');
        mkdirSync(path.dirname(shotPath), { recursive: true });
        writeFileSync(shotPath, image.toPNG());
        logLine('renderer-capture', shotPath);
        if (autoQuitAfterCapture) {
          setTimeout(() => {
            app.quit();
          }, 150);
        }
      });
    }, 900);
    void window.webContents
      .executeJavaScript(
        `JSON.stringify({
          rootHtml: document.getElementById('root')?.innerHTML ?? null,
          scriptCount: document.scripts.length,
          bodyText: document.body?.innerText ?? ''
        })`
      )
      .then((snapshot) => {
        logLine('renderer-snapshot', snapshot);
      })
      .catch((error) => {
        logLine(
          'renderer-snapshot-error',
          error instanceof Error ? error.stack ?? error.message : String(error)
        );
      });
  });

  window.webContents.on('console-message', (event) => {
    logLine('renderer-console', event.level, event.message);
  });

  if (rendererUrl) {
    const targetUrl = new URL(rendererUrl);
    if (demoScenario) {
      targetUrl.searchParams.set('demo', demoScenario);
    }
    void window.loadURL(targetUrl.toString());
  } else {
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
    logLine('loading-file', indexPath);
    void window.loadFile(indexPath, {
      search: demoScenario ? `demo=${encodeURIComponent(demoScenario)}` : undefined
    });
  }

  window.removeMenu();
  window.setMenuBarVisibility(false);

  return window;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  ipcMain.handle('dashboard:get', buildDashboard);
  ipcMain.handle('account:refresh-all', refreshAll);
  ipcMain.handle('account:refresh', (_event, accountId: string) => refreshAccount(accountId));
  ipcMain.handle('account:delete', (_event, accountId: string) => deleteAccount(accountId));
  ipcMain.handle('account:capture-current-auth', (_event, input: CaptureAccountInput) =>
    captureCurrentAuth(input)
  );
  ipcMain.handle('account:switch', (_event, accountId: string) => switchSelectedAccount(accountId));
  ipcMain.handle('account:switch-recommended', switchRecommendedAccount);
  ipcMain.handle('codex:terminate', terminateCodex);

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
