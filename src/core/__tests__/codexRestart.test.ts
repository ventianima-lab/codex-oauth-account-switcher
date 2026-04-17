import { describe, expect, it } from 'vitest';
import { buildCodexTerminationScript, toCodexTerminationErrorMessage } from '../codexRestart';

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

describe('toCodexTerminationErrorMessage', () => {
  it('explains access denied as a privilege mismatch', () => {
    expect(
      toCodexTerminationErrorMessage(
        new Error('Stop-Process : Cannot stop process "Codex (6852)" because of the following error: Access is denied')
      )
    ).toBe(
      '실행 중인 Codex가 더 높은 권한으로 열려 있어 앱에서 종료할 수 없습니다. 계정 전환기를 관리자 권한으로 다시 실행하거나, Codex를 직접 종료해 주세요.'
    );
  });

  it('keeps the missing-process message user friendly', () => {
    expect(
      toCodexTerminationErrorMessage(new Error('실행 중인 Codex 프로세스를 찾을 수 없습니다.'))
    ).toBe('실행 중인 Codex 프로세스를 찾을 수 없습니다.');
  });

  it('falls back to a generic terminate failure message', () => {
    expect(toCodexTerminationErrorMessage(new Error('unexpected'))).toBe(
      'Codex 종료 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
    );
  });
});
