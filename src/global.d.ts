import type { DesktopApi } from './shared/desktopApi';

declare global {
  interface Window {
    desktopApi: DesktopApi;
  }
}

export {};
