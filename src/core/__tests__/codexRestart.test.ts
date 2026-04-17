import { describe, expect, it } from 'vitest';
import { buildCodexTerminationScript } from '../codexRestart';

describe('buildCodexTerminationScript', () => {
  it('builds a termination-only script for Codex processes', () => {
    const script = buildCodexTerminationScript();

    expect(script).toContain('$codexProcesses');
    expect(script).toContain('Get-Process Codex');
    expect(script).toContain('Stop-Process -Force');
    expect(script).toContain('실행 중인 Codex 프로세스를 찾을 수 없습니다.');
    expect(script).not.toContain('Get-StartApps');
    expect(script).not.toContain('Start-Process');
  });
});
