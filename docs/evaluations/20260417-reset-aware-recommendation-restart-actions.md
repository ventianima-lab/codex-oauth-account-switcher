# Evaluation

## Metadata
- Task ID: `20260417-reset-aware-recommendation-restart-actions`
- Evaluation status: `pass-with-notes`

## What changed
- Recommendation scoring now considers reset timing in addition to the earlier quota bottleneck and plan multiplier.
- Account cards now show both reset timestamps with the requested local relative formatting.
- The dashboard now exposes two persistent restart actions for normal and elevated Codex relaunch.

## Notes
- Deterministic checks are green: plan gate, tests, lint, build, and renderer launch evidence all passed.
- The remaining note is runtime-only: the normal and elevated restart buttons still need one live Windows process check against a real running Codex app.
