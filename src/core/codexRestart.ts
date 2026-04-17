export function buildCodexTerminationScript(): string {
  return [
    '$codexProcesses = @(Get-Process Codex -ErrorAction SilentlyContinue);',
    'if ($codexProcesses.Count -eq 0) { throw "실행 중인 Codex 프로세스를 찾을 수 없습니다." }',
    '$codexProcesses | Stop-Process -Force;'
  ].join(' ');
}
