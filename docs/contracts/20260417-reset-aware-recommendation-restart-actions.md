# Contract

## Metadata
- Task ID: `20260417-reset-aware-recommendation-restart-actions`
- Phase: `contract`
- Status: `active`
- Scope owner: `Codex`

## Acceptance Criteria
- Recommendation uses remaining quota plus reset timing, so a sooner-reset account can outrank an otherwise equal later-reset account.
- Each account card shows `5시간 초기화` and `1주 초기화`.
- The summary bar always shows both `완전 종료 후 재시작` and `완전 종료후 코덱스를 관리자 권한으로 재시작`.
- `npm test`, `npm run lint`, and `npm run build` pass.

## Manual QA
- Confirm a faster-reset account is marked as the recommendation when its remaining quota is otherwise equal.
- Confirm both reset timestamps render as `오늘 HH:mm`, `내일 HH:mm`, or `M/D HH:mm`.
- Confirm both restart buttons are visible and invoke the intended normal/elevated relaunch flow on Windows.
