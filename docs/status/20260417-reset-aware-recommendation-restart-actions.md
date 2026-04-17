# Status

## Metadata
- Task ID: `20260417-reset-aware-recommendation-restart-actions`
- Phase: `evaluate`
- Lifecycle status: `implementation-verified`
- Requested execution mode: `balanced`
- Effective execution mode: `balanced`
- Planner authority evidence: `strongest-available local planning because outer developer policy blocked delegated planner lanes`
- Reviewer-route evidence: `strongest-available local approval review passed and the draft was promoted`

## Done
- Added reset-aware recommendation weighting so reset timing influences account choice without overpowering clearly larger remaining capacity.
- Added `5시간 초기화` and `1주 초기화` account-card fields with relative date formatting.
- Added two always-visible restart actions in the summary bar and wired normal/elevated Codex restart IPC.
- Added tests for recommendation timing, reset label formatting, and restart script generation.

## Validation
- `python C:\Users\GPUVM\.codex\check_plan_gate.py validate --task-id 20260417-reset-aware-recommendation-restart-actions --draft docs/plans/drafts/20260417-reset-aware-recommendation-restart-actions.md --review docs/plan-reviews/20260417-reset-aware-recommendation-restart-actions.md --approved docs/plans/20260417-reset-aware-recommendation-restart-actions.md` passed on `2026-04-17`.
- `python C:\Users\GPUVM\.codex\check_plan_gate.py promote --task-id 20260417-reset-aware-recommendation-restart-actions --draft docs/plans/drafts/20260417-reset-aware-recommendation-restart-actions.md --review docs/plan-reviews/20260417-reset-aware-recommendation-restart-actions.md --approved docs/plans/20260417-reset-aware-recommendation-restart-actions.md` passed on `2026-04-17`.
- `npm test` passed on `2026-04-17`.
- `npm run lint` passed on `2026-04-17`.
- `npm run build` passed on `2026-04-17`.
- `npm start` launched and `.debug/main.log` captured the new summary-bar restart buttons on `2026-04-17`.

## Remaining Manual Check
- Trigger the two restart buttons against a real Codex process and confirm normal restart plus admin-elevated restart both work on the local Windows machine.
