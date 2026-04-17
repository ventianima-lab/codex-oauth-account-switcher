export function buildCodexTerminationScript(): string {
  return [
    '$codexProcesses = @(Get-Process Codex -ErrorAction SilentlyContinue);',
    'if ($codexProcesses.Count -eq 0) { throw "실행 중인 Codex 프로세스를 찾을 수 없습니다." }',
    '$codexProcesses | Stop-Process -Force;'
  ].join(' ');
}

export function toCodexTerminationErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('실행 중인 Codex 프로세스를 찾을 수 없습니다.')) {
    return '실행 중인 Codex 프로세스를 찾을 수 없습니다.';
  }

  if (message.toLowerCase().includes('access is denied')) {
    return '실행 중인 Codex가 더 높은 권한으로 열려 있어 앱에서 종료할 수 없습니다. 계정 전환기를 관리자 권한으로 다시 실행하거나, Codex를 직접 종료해 주세요.';
  }

  return 'Codex 종료 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
}
