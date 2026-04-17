# Plan Draft

## Metadata
- Task ID: `20260409-switch-followups`
- Title: restart badge and recommendation follow-ups
- Phase: `plan`
- Plan status: `draft`
- Requested by: user
- Requested execution mode: `balanced`
- Effective execution mode: `single`
- Single-agent exception reason: developer policy did not permit spawning subagents because the user did not explicitly ask for delegation

## Goal
- Fix the stuck `재시작 필요` state, add a top-level recommended-switch action, and remove the no-longer-wanted Codex-login registration menu.

## Scope
- Detect when Codex has actually restarted and clear pending restart verification automatically.
- Expose `추천 계정으로 전환` from the summary bar.
- Remove the Codex-login-start registration path from the UI and simplify the add-account modal.
- Update usage/help docs and keep the UI copy less visually noisy.

## Validation
- `npm test`
- `npm run lint`
- `npm run build`
- `npm start`

## Risks
- Pending restart state can clear too early if runtime state only watches auth file writes and not Codex process lifecycle.
- Removing the registration menu must not break direct capture of the currently logged-in Codex auth bundle.
