# 사용 방법

## 실행

```bash
npm install
npm start
```

또는 [Run OAuth Account Switcher.cmd](/C:/programo/계정%20전환기/Run%20OAuth%20Account%20Switcher.cmd) 를 더블클릭해 실행할 수 있습니다.

## 계정 추가

1. Codex에 원하는 계정으로 로그인합니다.
2. 앱에서 `계정 추가`를 누릅니다.
3. 계정 이름을 적습니다.
4. `현재 Codex 인증 저장`을 눌러 저장합니다.

같은 계정은 중복 추가되지 않습니다.

## 추천 계정으로 전환

- 상단의 `추천으로 전환`을 누르면 현재 가장 유리한 계정으로 바로 전환 준비를 합니다.
- 이미 추천 계정이 활성 상태면 버튼은 비활성화됩니다.

## 특정 계정으로 전환

1. 카드에서 `이 계정으로 전환`을 누릅니다.
2. 앱이 `~/.codex/auth.json`을 교체합니다.
3. Codex를 다시 열면 적용됩니다.

전환 직후 카드에는 `재시작 필요`가 보일 수 있습니다. Codex를 한 번 닫았다가 다시 열면 앱이 상태를 자동으로 정리합니다.

## 사용량 갱신

- 카드의 `갱신`: 해당 계정만 갱신
- 상단의 `전체 갱신`: 전체 계정 갱신

## 삭제

- 카드의 `삭제`를 누르면 계정 목록과 저장된 번들이 함께 제거됩니다.

## 저장 위치

- `~/.oauth-account-switcher/catalog.json`
- `~/.oauth-account-switcher/bundles/`
- `~/.oauth-account-switcher/backups/`
- `~/.oauth-account-switcher/app-state.json`

## 공개용 자산 생성

README용 스크린샷은 아래 명령으로 재생성할 수 있습니다.

```bash
npm run screenshots:capture
```

결과물은 `docs/media/` 아래에 저장됩니다.
