import path from 'node:path';

export function resolvePreloadPath(appPath: string): string {
  const packagedMarker = `${path.sep}app.asar`;

  if (appPath.endsWith(packagedMarker) || appPath.endsWith('/app.asar')) {
    return path.join(appPath, 'dist-electron', 'electron', 'preload.cjs');
  }

  return path.join(appPath, 'electron', 'preload.cjs');
}
