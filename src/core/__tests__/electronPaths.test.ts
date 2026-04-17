import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolvePreloadPath } from '../electronPaths';

describe('resolvePreloadPath', () => {
  it('uses the source preload path in the unpackaged app shell', () => {
    expect(resolvePreloadPath('C:/workspace/app')).toBe(
      path.join('C:/workspace/app', 'electron', 'preload.cjs')
    );
  });

  it('uses the packaged dist-electron preload path when running from app.asar', () => {
    expect(resolvePreloadPath('C:/Program Files/OAuth Account Switcher/resources/app.asar')).toBe(
      path.join(
        'C:/Program Files/OAuth Account Switcher/resources/app.asar',
        'dist-electron',
        'electron',
        'preload.cjs'
      )
    );
  });
});
