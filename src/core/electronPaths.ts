import path from 'node:path';

export function resolvePreloadPath(appPath: string): string {
  return path.join(appPath, 'electron', 'preload.cjs');
}
