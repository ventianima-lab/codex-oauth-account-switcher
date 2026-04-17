import type { RegistrationState } from '../../shared/desktopApi';

export function getRegistrationHelpText(registration: RegistrationState | null): string {
  if (registration?.mode === 'codex-login') {
    return 'Codex에서 로그인한 뒤 Codex를 닫고, 현재 Codex 인증 저장을 누르면 새 계정이 추가됩니다.';
  }

  return '지금 로그인된 계정을 바로 저장할 수 있습니다. 다른 계정도 Codex에서 로그인한 뒤 같은 방식으로 추가하세요.';
}
