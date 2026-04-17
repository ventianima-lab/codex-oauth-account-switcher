# Contract

## Metadata
- Task ID: `20260408-oauth-account-switcher-v1`
- Title: OAuth account switcher desktop app v1
- Owner: Codex
- Requested by: user
- Mode: `implementation`
- Execution mode: `balanced`
- Phase: `contract`
- Status: `active`
- Created at: `2026-04-08`
- Last updated at: `2026-04-08`
- Related paths:
  - Draft plan: `docs/plans/drafts/20260408-oauth-account-switcher-v1.md`
  - Approved plan: `docs/plans/20260408-oauth-account-switcher-v1.md`
  - Plan review: `docs/plan-reviews/20260408-oauth-account-switcher-v1.md`
  - Contract: `docs/contracts/20260408-oauth-account-switcher-v1.md`
  - Runbook: `docs/runbooks/implement.md`
  - Status: `docs/status/20260408-oauth-account-switcher-v1.md`
  - Evaluation: `docs/evaluations/20260408-oauth-account-switcher-v1.md`
  - Research summary:

## Scope
- Bootstrap the app and implement the first usable dashboard, persistence, recommendation, and switch boundaries.

## Non-goals
- Automatic restart and profile fallback restore.

## User-visible behavior
- The user can open a Windows desktop app shell, see account cards, add accounts through a UI flow, refresh state, delete accounts, and switch the active account with restart guidance.
- The add-account flow opens a login window and captures the current Codex auth bundle into encrypted local storage.
- Usage refresh reads live 5-hour and 1-week usage data from the current access token when the upstream endpoint responds.

## Acceptance criteria
- [ ] The workspace contains a runnable desktop app scaffold.
- [ ] The dashboard shows account cards with refresh, delete, and switch actions.
- [ ] Recommendation scoring uses both 5-hour and 1-week remaining values.
- [ ] Persistence stores account metadata locally.
- [ ] Session bundles are stored encrypted instead of plain text.
- [ ] Switching backs up the current auth bundle and marks pending restart verification.
- [ ] Build validation passes.

## Validation commands
- `npm install`
- `npm run lint`
- `npm run build`

## Manual QA
- Open the app and verify the dashboard layout and state transitions.
- Confirm the switch action updates the active account state and shows restart guidance.

## Write Scope
- Files or directories allowed to change:
  - `C:\programo\계정 전환기`
- Files or directories that must remain read-only:
  - `README.md`
  - `NEXT_SESSION_PROMPT.md`
