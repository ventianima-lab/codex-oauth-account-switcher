# Contract

## Metadata
- Task ID: `20260409-switch-followups`
- Phase: `contract`
- Status: `active`
- Scope owner: Codex

## Acceptance Criteria
- `재시작 필요` is cleared only after Codex has actually been closed and reopened.
- The dashboard has a top-level `추천 계정으로 전환` action.
- The add-account modal no longer shows the removed Codex-login-start route.
- `npm test`, `npm run lint`, and `npm run build` pass.

## Manual QA
- Switch to another account, close Codex, reopen Codex, and confirm the pending restart badge disappears.
- Confirm the recommended-switch button is present and disabled when no recommended switch target exists.
