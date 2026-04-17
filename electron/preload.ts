import { contextBridge, ipcRenderer } from 'electron';
import type { DesktopApi } from '../src/shared/desktopApi';
const desktopApi: DesktopApi = {
  getDashboard: () => ipcRenderer.invoke('dashboard:get'),
  refreshAll: () => ipcRenderer.invoke('account:refresh-all'),
  refreshAccount: (accountId) => ipcRenderer.invoke('account:refresh', accountId),
  deleteAccount: (accountId) => ipcRenderer.invoke('account:delete', accountId),
  captureCurrentAuth: (input) => ipcRenderer.invoke('account:capture-current-auth', input),
  switchAccount: (accountId) => ipcRenderer.invoke('account:switch', accountId),
  switchRecommendedAccount: () => ipcRenderer.invoke('account:switch-recommended'),
  terminateCodex: () => ipcRenderer.invoke('codex:terminate')
};

contextBridge.exposeInMainWorld('desktopApi', desktopApi);
