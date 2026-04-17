# Plan Template

## Metadata
- Task ID: `20260408-oauth-account-switcher-v1`
- Title: OAuth account switcher desktop app v1
- Owner: Codex
- Requested by: user
- Phase: `plan`
- Plan status: `approved`
- Draft path: `docs/plans/drafts/20260408-oauth-account-switcher-v1.md`
- Approved path: `docs/plans/20260408-oauth-account-switcher-v1.md`
- Plan review path: `docs/plan-reviews/20260408-oauth-account-switcher-v1.md`
- Review attempt: `4`
- Requested execution mode: `balanced`
- Effective execution mode: `balanced`
- Reviewer result: `Pass`
- Blocked reason:
`none`2026-04-08`
- Last updated at: `2026-04-08`
- Related paths:
  - Contract: `docs/contracts/20260408-oauth-account-switcher-v1.md`
  - Runbook: `docs/runbooks/implement.md`
  - Status: `docs/status/20260408-oauth-account-switcher-v1.md`
  - Evaluation: `docs/evaluations/20260408-oauth-account-switcher-v1.md`
  - Research summary:
  - Approved design: `docs/superpowers/specs/2026-04-08-oauth-account-switcher-design.md`

## Release Rule
- This draft is not user-visible as a final plan until the plan-review artifact passes and `check_plan_gate.py promote` succeeds.

## Goal
- Deliver the first usable Windows desktop app in this workspace for multi-account OAuth switching with automatic usage-based recommendation and restart guidance.

## Scope
- Bootstrap an Electron + React + TypeScript desktop application.
- Build a single dashboard screen with account cards and an add-account modal flow.
- Add a browser-window based registration flow that lets the user sign in manually and capture reusable account auth/session state.
- Persist account metadata locally and keep auth payload storage behind an encrypted store boundary.
- Implement recommendation scoring from both 5-hour and 1-week remaining values.
- Implement a deterministic live-auth adapter against the local Codex auth file format and wire it into the UI action layer.
- Provide a usage-reader adapter contract plus a first integration shell that can later read upstream usage values without redesigning the app.
- Add a safe switch contract with backup/abort behavior and pending restart-time verification state.

## Non-goals
- Automatic Codex restart
- Full browser profile snapshot fallback in this pass
- Background tray or service behavior
- Cross-device sync
- Claiming production-complete upstream usage scraping before the adapter path is verified

## Reference Target Boundary Contract
- reference source: `README.md`, `NEXT_SESSION_PROMPT.md`, and `docs/superpowers/specs/2026-04-08-oauth-account-switcher-design.md`
- implementation target: `C:\programo\계정 전환기`
- reference-only paths:
  - `C:\programo\계정 전환기\README.md`
  - `C:\programo\계정 전환기\NEXT_SESSION_PROMPT.md`
- write-authorized roots:
  - `C:\programo\계정 전환기\AGENTS.md`
  - `C:\programo\계정 전환기\docs`
  - `C:\programo\계정 전환기\electron`
  - `C:\programo\계정 전환기\src`
  - `C:\programo\계정 전환기\public`
  - `C:\programo\계정 전환기\package.json`
  - `C:\programo\계정 전환기\package-lock.json`
  - `C:\programo\계정 전환기\tsconfig.json`
  - `C:\programo\계정 전환기\tsconfig.node.json`
  - `C:\programo\계정 전환기\vite.config.ts`
  - `C:\programo\계정 전환기\eslint.config.js`
- reference-equals-target override rule: not applicable because reference-only files are excluded from writable roots

## Bundle Size Governance
- bundle-size justification: registration, encrypted storage, recommendation, and auth switching must land together to produce a meaningful first-run desktop utility
- failure family: no usable desktop OAuth switcher exists in the workspace
- independent-task reason: this bundle establishes the minimal runnable product rather than a detached scaffold
- micro-slice rejection rule: do not split shell, account catalog, recommendation, and switching boundaries into separate approved micro-plans
- preferred bundle size: one v1 foundation bundle

## Roadmap Master Phase Contract
- source roadmap title: OAuth account switcher desktop utility
- source roadmap artifact: `C:\programo\계정 전환기\docs\superpowers\specs\2026-04-08-oauth-account-switcher-design.md`
- phase label: `foundation-v1`
- phase sequencing rule: `plan -> contract -> implement -> evaluate`
- phase exit rules:
  - app scaffold installs and builds
  - dashboard renders account cards and actions
  - manual sign-in registration stores an encrypted session bundle
  - recommendation logic is covered by deterministic tests
  - auth-switch adapter is covered by deterministic file-based tests
- phase widening rule: usage scraping hardening and browser profile snapshot fallback remain follow-up work after the OAuth-first v1 slice approved in chat

## Orchestration Kernel Contract
- canonical schema source: sure templates under `C:\Users\GPUVM\.codex\templates\확실하게`
- artifact generator: manual template-backed authoring in this workspace
- task-router manifest: local sure artifact mapping in `C:\programo\계정 전환기\AGENTS.md`
- router-selected lane set: `planner-of-record -> approval reviewer -> local implementer -> verifier`
- sure-task local resume state: repo-local docs artifacts
- resume-state storage allowlist: `docs/`

## Operator Preflight Kernel Contract
- operator preflight policy: validate available desktop stack before app selection
- operator prep command: `node --version` and `npm --version`
- operator preflight state: complete
- session resume index: not applicable for this local app scaffold
- readiness report template: status artifact plus final closeout
- launch-ready rule: implementation starts only after approved plan exists

## Control Plane Contract
- mailbox route evidence: plan review delegated to independent xhigh reviewer
- plan approval handoff evidence: draft path + review artifact path + publish gate
- command-busy wait rule: subordinate silence while the host is command-busy is healthy-by-default until a post-command wait completes
- router-to-permission handoff: orchestrator selects plan-review gate before implementation
- deferred control-plane boundary: no runtime mailbox or backend control plane in this task

## Runtime Activation Kernel Contract
- runtime activation manifest: Electron main process plus renderer bootstrap
- skill loading set: not applicable to app runtime
- bundled/local/plugin candidate loading policy: not applicable
- activation mode: manual desktop launch
- task class routing hook: UI action dispatch through preload IPC
- session bootstrap rule: app initializes local catalog store on startup
- session restore rule: renderer reloads persisted account state from local store
- operator-preflight requirement: Node/NPM availability

## Remote Runtime Kernel Contract
- remote runtime manifest: not applicable
- remote-capable task classes: not applicable
- mailbox protocol families: not applicable
- backend candidate classes: not applicable
- remote session bootstrap rule: not applicable
- remote session restore rule: not applicable
- leader permission handoff requirement: not applicable
- remote-safe-exec unlock rule: not applicable

## Runtime Session Control Contract
- runtime session index: local account catalog store
- current task pointer: `20260408-oauth-account-switcher-v1`
- artifact lineage state: active
- superseded by task:
- approved artifact pointer set: pending until plan promotion
- current activation phase: planning
- resume eligibility: yes
- selected lane set: `plan -> review -> implement -> evaluate`
- session bootstrap provenance: local bootstrap from empty workspace
- session restore provenance: persisted catalog file

## Remote Session Control Contract
- remote-runtime session index: not applicable
- current remote-readiness phase: not applicable
- chosen backend candidate: not applicable
- bootstrap/restore provenance: not applicable
- mailbox route evidence: not applicable

## Safe Execution Kernel Contract
- leader permission bridge contract: orchestrator controls write scope
- permission lattice contract: write only inside approved roots
- permission classifier contract: reference-only files remain read-only
- shell adapter contract: PowerShell commands via Codex shell tool
- safe exec wrapper: built-in shell command runner
- path safety contract: no writes outside workspace roots listed above
- implementation-entry enforcement: blocked until approved plan path exists

## Extension Boundary Kernel Contract
- vendor snapshot manifest: not applicable
- active adoption ledger: not applicable
- plugin helper registry: not applicable
- plugin helper policy: not applicable
- metadata hook registry: not applicable
- metadata-only observability policy: not applicable

## Reference Baseline
- Source root: `C:\programo\계정 전환기`
- Frozen external baseline files:
  - `README.md`
  - `NEXT_SESSION_PROMPT.md`
- Selected import themes:
  - desktop utility
  - account cards
  - OAuth switching
  - usage-based recommendation
- Deferred import themes for follow-up:
  - browser profile snapshot fallback
  - hardened upstream usage scraping
- Acceptance rule: implementation follows the approved design spec, which is the authoritative v1 scope artifact for the OAuth-first desktop utility with restart guidance rather than full browser profile snapshot fallback

## Activation Policy Contract
- source group: `local-agents`
- activation mode: `manual`
- selection owner: `local-agents`
- conditional activation evidence: sure workflow activated by explicit user request
- runtime phase label: `foundation-v1`
- approved runtime slice: Electron shell, React dashboard, local store, recommendation core, auth adapter
- runtime loader follow-up boundary: no loader work outside the desktop app
- vendor import root: not applicable
- reference snapshot policy: baseline docs remain read-only
- plugin bridge state: not-needed-yet
- plugin bridge necessity evidence: workspace is app-local and does not need plugin bridge behavior

## Investigation Contract
- investigation trigger evidence: no explicit sure investigation wording triggered the investigation lane
- investigation route class: explicit first-class mode under sure with mandatory GPT/browser-backed investigation
- investigation mode default: GPT/browser-backed when explicit sure investigation wording is present
- gpt investigation requirement: required for every sure investigation invocation; local fanout may supplement but never replace it
- gpt investigation status: not-triggered
- gpt investigation artifact: not-applicable
- non-gpt exception evidence: not applicable
- non-gpt exception evidence home: not-applicable
- canonical research summary: not-required
- research-summary artifact path: not-applicable
- research-summary schema replacement: replace bypass-era investigation fields with gpt/browser-backed investigation status | gpt/browser-backed investigation artifact | non-gpt exception evidence, and replace handoff-ready state with ready-with-completed-gpt-investigation | blocked-missing-gpt-investigation | stop
- investigation-to-plan handoff rule: planning may continue only after the research summary records completed GPT/browser-backed evidence for the same task

## External Plan Intake Contract
- plan origin: local sure planning
- origin route class: sure
- origin transcript anchor: current conversation
- source plan artifact:
- apply-intent evidence: user requested `확실하게 계획해서 구현`
- external-plan quarantine state: not applicable
- sure confirmation required: true
- sure review result: pending
- execution lock state: locked
- quarantine release source: approved plan path
- external-plan fallback reason: not applicable
- execution-intent intercept route: sure-plan-confirm
- implementation-entry gate: blocked until sure pass

## Combined Plan-Implementation Intent Contract
- combined intent evidence: user explicitly requested planning and implementation in one flow
- planning-intent intercept route: sure-plan-confirm
- plan-first execution rule: implementation remains blocked until the same task has an approved sure plan and passing review artifact
- combined-intent negative evidence: no user instruction bypassed the plan gate

## Authority Contract
- planner authority: `gpt-5.4 / xhigh planner-of-record subagent by default`
- planner-of-record evidence: draft plan plus approval review artifact
- reviewer authority: `gpt-5.4 / xhigh approval reviewer`
- orchestrator authority: `manager | mediator | canonical writer`
- reviewer-route evidence: pending
- approval payload retrieval state: pending
- runtime authority enforcement: workspace-local only

## Closeout Lifecycle State Contract
- closeout lifecycle state: `planning`
- release-state source: draft plan
- correctness evidence state: pending
- operational evidence state: pending
- performance evidence state: not-required
- performance evidence profile: not-applicable
- compat shim policy: not-required
- compat evidence state: not-required
- artifact cadence policy: update status after plan approval, implementation, and evaluation
- overall release gate: closed until plan promotion and validation pass
- invalid transition examples:
  - claiming implementation complete while execution lock is still locked
  - claiming release ready before lint/build/tests pass

## Operational Norm Contract
- sure operational norm tier: top-operational-norm-in-global-harness-layer
- weaker global default override rule: blocked
- editable global precedence rule: 확실하게 is the highest operational norm inside editable global settings under C:\Users\GPUVM\.codex and C:\Users\GPUVM\.codex\skills
- editable global conflict rule: blocked
- non-editable policy boundary: system/developer/tool policy and deeper local repo policy only
- multi-agent default: required for non-trivial sure work
- planner separation default: enabled
- reviewer separation default: enabled
- verification separation default: enabled when implementation changes code, config, schema, contracts, or decision-critical docs
- single-agent exception reason:
- delegation constraint evidence:

## Execution Mode Contract
- execution mode vocabulary: `balanced` | `heavy` | `single`
- requested execution mode: `balanced`
- effective execution mode: `balanced`
- default execution mode: balanced
- explicit heavy mode trigger: explicit only
- explicit single mode trigger: explicit only
- execution topology: separated planning review with local implementation and verification
- balanced lane-count preservation: keep planning review separate and retain independent verification
- heavy mode breadth: not used
- single strongest-available closeout semantics: not used

## Delegation Preflight Contract
- delegation policy preflight: required and completed
- delegation policy preflight state: complete
- delegation preflight result: clearly-allowed for this task because the user explicitly requested `확실하게 계획해서 구현`; ask-user-first remains the fallback state when explicit same-task authorization is absent
- delegation preflight classifier inputs: explicit sure planning-and-implementation wording from the user
- clearly-allowed evidence rule: use clearly-allowed only when explicit same-task authorization for ordinary sure delegated routing is already present and no deeper local or outer-policy boundary requires the user to be asked again
- ask-user-first evidence rule: absent, incomplete, blocked, or ambiguous authorization maps to ask-user-first; blocked and ambiguous do not unlock direct single-agent start
- delegation confirmation prompt rule: when ask-user-first applies, ask the user once before substantive work and keep the intended delegated route explicit
- user delegation decision state: allowed
- single-agent fallback consent state: not needed
- single-agent entry rule: allowed only after explicit user decline or confirmed-subagent-use plus concrete external-boundary evidence
- mid-task surprise fallback rule: do not newly announce subagent unavailability or direct single-agent fallback mid-task unless the start-of-task record already proved the fallback authority
- post-confirmation external boundary rule: keep strongest available fallback explicit

## Planning Question Intake Contract
- planning-question intake policy: ask before drafting
- planning-question applicability rule: applicable for non-trivial product design
- planning-question default count: 3-5
- planning-question shape rule: short planning questions only
- planning-question skip rule: skip only with explicit skip evidence
- planning-question skip evidence: no skip evidence recorded because intake was completed
- drafting follow-up question policy: one bounded round only
- drafting follow-up question budget: one bounded round with 2 short questions
- drafting follow-up question trigger rule: only if core product shape remains ambiguous
- draft-authoring start gate: draft authoring stays blocked until intake completes or skip evidence is recorded
- ask 3-5 short pre-draft planning questions by default unless the task is clearly unnecessary to query and skip evidence is recorded.
- limit drafting follow-up questions to one round with at most 2 short questions.
- keep draft authoring blocked until intake completes or skip evidence is recorded.

## Harness Completion Boundary Contract
- completion domain: workspace app scaffold and v1 feature slice
- harness completeness claim: not complete until implementation and evaluation close
- external constraint boundary: upstream undocumented usage source remains an integration risk and browser profile snapshot fallback is deferred by approved v1 scope
- strongest-available release boundary: local v1 app only
- pass-with-notes note class: only for non-blocking upstream adapter caveats after green deterministic validation
- transcript anchor evidence: current conversation and local docs artifacts

## Subordinate Wait Discipline Contract
- covered lanes:
  - planner-of-record
  - approval reviewer
- explicit exemptions:
  - local implementation commands
- named wait budget or inherited baseline: one-hour quiet wait inherited baseline for covered lanes
- covered-lane wait budget policy: one-hour quiet wait inherited baseline before fallback
- same-agent re-contact: required before any substitute lane
- post-contact wait: required
- same-role substitute: fallback only after explicit unhealthy evidence
- healthy-lane silence rule: silence within the quiet-wait baseline is healthy-by-default
- unnecessary liveness ping rule: do not send status-only pings
- re-contact trigger rule: only on explicit unhealthy evidence or the fully exhausted one-hour quiet wait sequence
- timeout alone: not approval evidence
- explicit no-response evidence: host-visible failure, attach error, mailbox rejection, or exhausted wait sequence
- fallback/new lane rule: record same-agent re-contact and post-contact outcome before substitution

## Worker Artifact Output Contract
- goal: independent plan review or bounded implementation artifact
- exact scope: named file set or plan artifact
- read-only status or write scope: explicit per lane
- findings: concise and evidence-backed
- evidence paths: local artifact paths
- changed files or file references: required
- commands run: required
- pass/fail status: required
- open risks: required
- recommended next step: required

## Delegation Hygiene Contract
- read-only fanout: allowed for review and bounded research
- one worker per non-overlapping write-heavy file set: required
- fresh-eyes verification: required for code closeout
- same-worker repair: allowed for high-overlap fix loops
- no worker-on-worker checking: enforced
- no lazy "based on your findings" handoff: enforced
- no trivial delegation: enforced

## Closeout Reporting Contract
- why this task existed: first usable OAuth switcher app for this workspace
- approved plan choice: this plan after review pass
- approved runtime slice: Electron shell, dashboard, catalog, recommendation, auth adapter
- what changed: app files, docs, validation artifacts
- blocker/repair loop: plan review blockers and fixes are recorded
- final approval state: pending
- remaining follow-ups: usage scraping hardening and profile fallback
- sure closeout precedence: sure artifacts outrank ad-hoc summary
- reporting helper role: final synthesis only
- closeout friendliness rule: keep the closeout scan-first and concise

## Architecture
- Electron main process owns the desktop shell and file-system capable operations.
- React renderer owns the dashboard UI, card states, and modal flows.
- `src/core/recommendation` computes effective capacity using both quota windows and selects the earlier bottleneck.
- `src/core/storage` persists account metadata and encrypted auth payload references.
- `src/core/security/sessionVault` encrypts and decrypts captured session bundles before they hit disk.
- `src/core/adapters/auth` reads and writes the local live auth state through a testable file adapter.
- `src/core/adapters/usage` exposes a provider boundary that can return real or fixture-backed usage values.
- `electron/authWindow` and `src/features/registration` own the manual browser sign-in capture flow.
- `src/core/verification` tracks pending restart verification and switch results.

## Rollback Plan
- Backup root: `app data backups/live-auth`
- Rollback manifest path: `docs/status/20260408-oauth-account-switcher-v1.md`
- Restore action tracking rule: record whether the previous live auth file was restored after a failed switch attempt
- Restore command contract: if auth write verification fails, restore the backed-up live auth payload before reporting failure

## Phase Exit Rules
- Reference boundary proof fails if `README.md` or `NEXT_SESSION_PROMPT.md` enters the changed file set or if implementation writes outside the listed roots.
- Bundle-size proof fails if the implementation omits either the dashboard shell, recommendation core, or auth-switch boundary, because that would collapse the bundle into a non-usable micro-slice.
- Registration proof fails if the implementation cannot open a manual sign-in window and save a captured account record.
- Encryption proof fails if a deterministic test can read raw token material directly from the persisted session bundle.
- Covered-lane proof fails if a planner or reviewer fallback occurs without the inherited wait baseline and same-agent re-contact evidence being recorded in the status artifact.
- Canonical artifact proof requires the draft plan, plan review, contract, and status files to keep the same task ID and updated approval state.
- Operator preflight proof requires recorded Node and NPM versions in the status artifact before app stack selection.
- Deterministic validation requires:
  - `npm run test` passes with `src/core/__tests__/sessionVault.test.ts`
  - `npm run test` passes with `src/core/__tests__/recommendation.test.ts`, `src/core/__tests__/authFileAdapter.test.ts`, `src/core/__tests__/switchOrchestrator.test.ts`, and `src/core/__tests__/restartVerification.test.ts`
  - `npm run lint` passes
  - `npm run build` passes
- Manual release proof requires:
  - add-account modal opens a manual sign-in window and stores an account
  - refresh action updates the selected card state
  - delete action removes an account
  - switch action updates the active account banner and shows restart guidance
  - failed switch restores the previous live auth state
  - successful switch records pending restart verification for the selected account
- This task closes the phase only when:
  - `npm run test` passes and includes deterministic tests for recommendation bottleneck scoring and auth-switch file behavior
  - `npm run lint` passes
  - `npm run build` passes
  - manual QA confirms add, refresh, delete, and switch actions update the UI and show restart guidance

## Files and Ownership
- Create:
  - `package.json`
  - `electron/`
  - `src/`
  - desktop app config files
- Modify:
  - `AGENTS.md`
  - `docs/contracts/20260408-oauth-account-switcher-v1.md`
  - `docs/status/20260408-oauth-account-switcher-v1.md`
  - `docs/evaluations/20260408-oauth-account-switcher-v1.md`
- Review-only:
  - `README.md`
  - `NEXT_SESSION_PROMPT.md`

## Task Breakdown
### Task 1
- Objective: bootstrap the Electron + React + TypeScript shell and dashboard scaffold
- Files:
  - `package.json`
  - `tsconfig.json`
  - `tsconfig.node.json`
  - `vite.config.ts`
  - `electron/main.ts`
  - `electron/preload.ts`
  - `src/main.tsx`
  - `src/App.tsx`
  - `src/styles.css`
- Validation:
  - `npm install`
  - `npm run build`

### Task 2
- Objective: implement account catalog persistence, encrypted session storage, and recommendation engine with deterministic tests
- Files:
  - `src/core/catalog.ts`
  - `src/core/recommendation.ts`
  - `src/core/storage.ts`
  - `src/core/security/sessionVault.ts`
  - `src/core/switchOrchestrator.ts`
  - `src/core/types.ts`
  - `src/core/__tests__/recommendation.test.ts`
  - `src/core/__tests__/storage.test.ts`
  - `src/core/__tests__/sessionVault.test.ts`
  - `src/core/__tests__/switchOrchestrator.test.ts`
  - `src/core/__tests__/restartVerification.test.ts`
- Validation:
  - `npm run test`
  - `npm run lint`

### Task 3
- Objective: implement registration flow, dashboard actions, and live-auth adapter boundary
- Files:
  - `src/features/accounts/components/AccountCard.tsx`
  - `src/features/accounts/components/AddAccountModal.tsx`
  - `src/features/accounts/components/SummaryBar.tsx`
  - `src/features/accounts/actions.ts`
  - `src/features/accounts/state.ts`
  - `src/features/registration/registerAccountFlow.ts`
  - `src/core/adapters/authFileAdapter.ts`
  - `src/core/adapters/usageProvider.ts`
  - `src/core/verification.ts`
  - `src/core/__tests__/authFileAdapter.test.ts`
  - `electron/preload.ts`
  - `electron/authWindow.ts`
- Validation:
  - `npm run test`
  - `npm run build`

## Validation Strategy
- Automated commands:
  - `npm install`
  - `npm run test`
  - `npm run lint`
  - `npm run build`
- Manual checks:
  - launch the app and verify account cards render
  - add an account through the manual sign-in path and confirm a new card appears
  - confirm recommendation badge changes when quota fixtures change
  - confirm refresh updates the card status and timestamp
  - confirm delete removes an account from the dashboard
  - confirm switch updates the active account state and shows restart guidance
  - confirm a failed switch restores the previous live auth state
  - confirm a successful switch marks the selected account as pending restart verification

## Risks and Mitigations
- Risk:
  - undocumented upstream usage source may drift
  - Mitigation: isolate usage logic behind a provider contract and keep deterministic fixture tests local
- Risk:
  - live auth schema may differ across machines
  - Mitigation: adapt against the observed local auth file shape and cover read/write behavior with file-backed tests
- Risk:
  - encrypted storage may be implemented incorrectly and leave secrets readable on disk
  - Mitigation: keep session bundle writes inside a dedicated vault module and add a deterministic plaintext-negative test
- Risk:
  - source docs mention profile fallback while chat-approved v1 narrows to OAuth-first switching
  - Mitigation: keep the scope override explicit in the plan and preserve browser profile snapshot fallback as a named follow-up

## Open Questions
- Question:
  - which upstream source will ultimately provide production usage data
  - Why it matters: the adapter contract should not lock the app into a brittle one-off source
