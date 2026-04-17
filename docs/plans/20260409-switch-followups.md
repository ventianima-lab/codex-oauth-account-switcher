# Approved Plan

## Metadata
- Task ID: `20260409-switch-followups`
- Title: restart badge and recommendation follow-ups
- Phase: `plan`
- Plan status: `approved`
- Draft path: `docs/plans/drafts/20260409-switch-followups.md`
- Review path: `docs/plan-reviews/20260409-switch-followups.md`
- Approved path: `docs/plans/20260409-switch-followups.md`
- Requested execution mode: `balanced`
- Effective execution mode: `single`
- Reviewer result: `Pass with notes`

## Execution Scope
1. Runtime state sync
   - Sync active account with the live Codex auth bundle.
   - Clear pending restart verification only after Codex has been observed stopped and then running again.
2. Dashboard actions
   - Add `추천 계정으로 전환` to the summary bar.
3. Registration cleanup
   - Remove the Codex-login-start menu from the add-account modal.
   - Keep direct capture of the currently logged-in Codex auth bundle.
4. Finish
   - Update docs and verify with tests, lint, build, and app launch.
