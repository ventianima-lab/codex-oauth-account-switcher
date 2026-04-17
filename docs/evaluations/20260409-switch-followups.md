# Evaluation

## Metadata
- Task ID: `20260409-switch-followups`
- Evaluation status: `pass-with-notes`

## What changed
- Restart verification now depends on actual Codex process stop/start observation rather than a sticky saved flag alone.
- The summary bar now exposes a recommended-switch action.
- The add-account flow is narrowed to the working direct-capture path.
- UI copy is shorter and less visually noisy.

## Notes
- The restart badge fix is verified by logic, polling, build, and launch evidence.
- Final confirmation of the restart badge disappearing still requires one real switch-and-reopen cycle on the desktop.
