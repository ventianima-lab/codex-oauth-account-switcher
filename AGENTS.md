# Local Agent Rules

## 확실하게 Mapping

- When the user requests `확실` work in this workspace, use the global `확실하게` workflow first.
- Active draft plan path: `docs/plans/drafts/<task-id>.md`
- Active approved plan path: `docs/plans/<task-id>.md`
- Active plan review path: `docs/plan-reviews/<task-id>.md`
- Active contract path: `docs/contracts/<task-id>.md`
- Active runbook path: `docs/runbooks/implement.md`
- Active status path: `docs/status/<task-id>.md`
- Active evaluation path: `docs/evaluations/<task-id>.md`
- Active research summary path: `docs/research/<task-id>.md`

## Task ID Convention

- Default task ID: `YYYYMMDD-short-task-name`
- Keep the same task ID across the draft plan, approved plan, plan review, contract, status, and evaluation artifacts.

## Repo-specific Validation Matrix

- Primary validation commands:
  - `npm install`
  - `npm run lint`
  - `npm run build`
- Plan publish gate:
  - `python C:\Users\GPUVM\.codex\check_plan_gate.py validate --task-id <task-id> --draft <draft-path> --review <review-path> --approved <approved-path>`
  - `python C:\Users\GPUVM\.codex\check_plan_gate.py promote --task-id <task-id> --draft <draft-path> --review <review-path> --approved <approved-path>`
- Manual QA or runtime checks:
  - Launch the desktop app, verify account cards render, and confirm add/refresh/delete/switch flows update the UI state.

## Execution and Architecture Rules

- Preferred implementation stack for this workspace is `Electron + React + TypeScript` unless the user explicitly asks for another Windows stack.
- Keep the app as a single-window dashboard for v1.
- Separate `core` logic from UI so the account catalog, recommendation engine, and auth/usage adapters can be tested independently.
- OAuth/session switching is the main product goal.
- Usage-based recommendation must consider both the 5-hour and 1-week windows and favor the earlier bottleneck, not a single-window percentage alone.

## Delegation and Review Rules

- Prefer independent review for plans and code changes when host policy allows.
- If delegation is unavailable, record the fallback reason explicitly in the sure artifacts.

