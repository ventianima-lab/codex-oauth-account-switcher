# OAuth Account Switcher Design

## Summary

Build a Windows desktop utility that lets the user register multiple Codex/OpenAI account sessions, read each account's 5-hour and 1-week remaining usage automatically, recommend the best account based on the earliest limiting window, and switch the live OAuth/auth state with one action. The app does not restart Codex automatically; it tells the user to restart after a successful switch.

## Product Shape

- Single-window desktop dashboard
- Account cards with current quota state, recommendation, and actions
- Add-account modal that opens a login browser window for manual sign-in
- Persistent local catalog of accounts
- Encrypted local storage for captured auth/session material
- Adapter layer for usage reading and live auth switching

## UX

- Top summary bar:
  - active account
  - recommended account
  - refresh all
  - add account
- Account card:
  - label
  - email if available
  - plan
  - 5-hour remaining
  - 1-week remaining
  - effective remaining score
  - last refreshed time
  - status badge
  - actions: switch, refresh, delete
- Success path:
  - after switch, show a clear success banner and tell the user to restart Codex
- Failure path:
  - if usage reading or auth switching fails, keep the account but mark it as attention-needed with a retry path

## Recommendation Rule

- Read both the 5-hour and 1-week remaining usage values for each account.
- Convert those values into the same normalized "effective remaining capacity" space.
- The account score is constrained by the earlier bottleneck of the two windows.
- The recommendation engine should therefore prefer the account with the largest practical remaining capacity, not merely the highest 5-hour percentage.

## Architecture

- `core/catalog`
  - account metadata and persistence
- `core/recommendation`
  - effective remaining capacity calculation and ranking
- `core/security`
  - encrypted storage helpers for auth payloads
- `core/adapters/usage`
  - usage reader contract and initial implementation shell
- `core/adapters/auth`
  - live auth switch contract and initial implementation shell
- `ui`
  - dashboard, cards, modal, status messaging
- `electron`
  - app shell, window creation, IPC boundaries

## Scope For V1

- Multiple account registration
- Card-based dashboard
- Refresh/delete/switch actions
- Recommendation engine based on 5-hour and 1-week limits
- Local encrypted storage contract
- Adapter interfaces and initial real implementation path for live auth/usage integration

## Non-goals

- Automatic Codex restart
- Complex multi-window settings flows
- Background service
- Cross-device sync
- Broad browser profile management unless later needed as a fallback

## Risks

- The exact usage source may rely on undocumented UI or internal requests and may need maintenance if upstream changes.
- The live auth format may rotate or differ between environments, so switching logic must stay adapter-based.

