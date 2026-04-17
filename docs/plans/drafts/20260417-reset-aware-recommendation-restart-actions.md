# Draft Plan

## Metadata
- Task ID: `20260417-reset-aware-recommendation-restart-actions`
- Title: reset-aware recommendation scoring and restart action options
- Owner: `Codex`
- Requested by: `user`
- Phase: `plan`
- Plan status: `draft`
- Draft path: `docs/plans/drafts/20260417-reset-aware-recommendation-restart-actions.md`
- Approved path: `docs/plans/20260417-reset-aware-recommendation-restart-actions.md`
- Plan review path: `docs/plan-reviews/20260417-reset-aware-recommendation-restart-actions.md`
- Review attempt: `1`
- Requested execution mode: `balanced`
- Effective execution mode: `balanced`
- Reviewer result: `pending`
- Blocked reason: `none`
- Created at: `2026-04-17T10:35:00+09:00`
- Last updated at: `2026-04-17T10:35:00+09:00`
- Related paths:
  - Contract: `docs/contracts/20260417-reset-aware-recommendation-restart-actions.md`
  - Runbook: `docs/runbooks/implement.md`
  - Status: `docs/status/20260417-reset-aware-recommendation-restart-actions.md`
  - Evaluation: `docs/evaluations/20260417-reset-aware-recommendation-restart-actions.md`
  - Research summary: `not-required because the route chain starts at planning and no investigation gate was requested`
- Approval route: `external GPT (Thinking Expanded) 1차`
- Fallback approval route: `internal gpt-5.4 / xhigh 2차`
- Metadata attachment packet: `draft plan + local AGENTS context + local validation matrix + current source file context + user answers from this thread`
- Metadata attachment freshness state: `fresh from current workspace reads on 2026-04-17`
- Metadata attachment-required gate: `satisfied for strongest-available local review path`
- Metadata attachment evidence: `the draft, local AGENTS rules, source anchors in src/core/recommendation.ts src/features/accounts/components/AccountCard.tsx src/App.tsx electron/main.ts, and the user's 3 planning answers are all captured in this task`

## Release Rule
- This draft is not user-visible as a final plan until the plan-review artifact passes and `check_plan_gate.py promote` succeeds.

## Goal
- Make account recommendation choose the best account using both remaining quota and time-until-reset, show each account's 5-hour and 1-week reset times on the card, and add always-visible restart actions for normal relaunch and elevated relaunch.

## Scope
- Update recommendation scoring so earlier reset windows can be intentionally favored when that produces better near-term usage efficiency.
- Add UI formatting for `오늘 HH:mm`, `내일 HH:mm`, and fallback `M/D HH:mm` reset labels.
- Add two always-visible restart buttons: `완전 종료 후 재시작` and `완전 종료 후 코덱스를 관리자 권한으로 재시작`.
- Wire main-process restart IPC for normal and elevated relaunch flows.
- Add or update tests for recommendation logic and restart IPC surface changes.

## Non-goals
- Do not change the storage schema for saved accounts.
- Do not redesign the overall dashboard layout beyond fitting the new reset lines and restart buttons.
- Do not change how usage data is fetched from ChatGPT.
- Do not add background tray behavior or multi-window desktop behavior.

## Reference Target Boundary Contract
- reference source: `current workspace implementation and existing AGENTS guidance`
- implementation target: `Electron + React + TypeScript app in this workspace`
- reference-only paths: `docs/plans/20260409-switch-followups.md and existing docs are read-only precedent`
- write-authorized roots: `C:\programo\계정 전환기\src`, `C:\programo\계정 전환기\electron`, `C:\programo\계정 전환기\docs`
- reference-equals-target override rule: `not-applicable because the reference source is local precedent and the implementation target remains the live workspace root`

## Bundle Size Governance
- bundle-size justification: `the request is one user-facing failure family because recommendation quality, reset visibility, and restart controls must land together to make switching decisions actionable`
- failure family: `the dashboard recommends accounts without reset-aware optimization and requires manual process handling after a switch`
- independent-task reason: `this bundle closes the full decision-and-action loop for switching rather than shipping isolated micro-patches`
- micro-slice rejection rule: `do not split recommendation scoring, reset display, and restart controls into separate approvals because the user asked for one cohesive workflow`
- preferred bundle size: `one balanced implementation pass with tests, lint, build, and manual app verification`

## Roadmap Master Phase Contract
- source roadmap title: `2026-04-17 reset-aware recommendation and restart controls`
- source roadmap artifact: `this draft plan`
- phase label: `phase-1 implementation bundle`
- phase sequencing rule: `plan-confirm -> implement -> evaluate within the same task id`
- phase exit rules: `finish only after tests, lint, build, and desktop restart-flow QA are recorded`
- phase widening rule: `no widening into unrelated account-management changes without a new approved plan`

## Orchestration Kernel Contract
- canonical schema source: `C:\Users\GPUVM\.codex\templates\확실하게\canonical-schema.json`
- artifact generator: `manual sure artifacts aligned to the local docs mapping`
- task-router manifest: `확실하게 -> sure-plan-confirm -> implementation -> evaluation`
- router-selected lane set: `orchestrator-only strongest-available lane because outer developer policy blocks spawn_agent without an explicit subagent request`
- sure-task local resume state: `docs artifacts are the canonical local resume surface for this task`
- resume-state storage allowlist: `docs/plans docs/plan-reviews docs/contracts docs/status docs/evaluations`

## Operator Preflight Kernel Contract
- operator preflight policy: `read local AGENTS first, map docs paths, and use the repo validation matrix before edits`
- operator prep command: `npm test`, `npm run lint`, `npm run build`
- operator preflight state: `complete for planning and pending for implementation verification`
- session resume index: `docs/status/20260417-reset-aware-recommendation-restart-actions.md`
- readiness report template: `scan-first sure closeout with compact result, validation, and risk fields`
- launch-ready rule: `the app must build and the desktop actions must be reachable from preload before runtime QA can pass`

## Control Plane Contract
- mailbox route evidence: `no delegated mailbox route is active because review is strongest-available local`
- plan approval handoff evidence: `approval is recorded in the local plan-review artifact for this task`
- command-busy wait rule: `subordinate silence is healthy-by-default while the host is command-busy, but no subordinate lanes are active in this strongest-available fallback`
- router-to-permission handoff: `the orchestrator owns all writes inside src electron docs under the current task scope`
- deferred control-plane boundary: `no external planner or browser reviewer is available in this turn, so approval is strongest-available local only`

## Runtime Activation Kernel Contract
- runtime activation manifest: `Electron preload IPC bridge plus React renderer actions`
- skill loading set: `확실하게 and sure-plan-confirm for planning; implementation proceeds under the approved plan`
- bundled/local/plugin candidate loading policy: `local workspace code only; no plugin or bundled runtime expansion`
- activation mode: `local workspace implementation`
- task class routing hook: `desktop account switching dashboard enhancement`
- session bootstrap rule: `renderer boots from App.tsx and desktop API methods from preload`
- session restore rule: `dashboard polling and persisted desktop state restore current account state after relaunch`
- operator-preflight requirement: `required before claiming implementation complete`

## Remote Runtime Kernel Contract
- remote runtime manifest: `not-applicable because this task stays fully local`
- remote-capable task classes: `none for this task`
- mailbox protocol families: `none`
- backend candidate classes: `none`
- remote session bootstrap rule: `not-applicable`
- remote session restore rule: `not-applicable`
- leader permission handoff requirement: `not-applicable`
- remote-safe-exec unlock rule: `not-applicable`

## Runtime Session Control Contract
- runtime session index: `desktop state file plus renderer polling`
- current task pointer: `20260417-reset-aware-recommendation-restart-actions`
- artifact lineage state: `active`
- superseded by task: `none`
- approved artifact pointer set: `draft pending review and promotion`
- current activation phase: `plan`
- resume eligibility: `eligible via local docs artifacts`
- selected lane set: `single strongest-available orchestrator lane`
- session bootstrap provenance: `current desktop workspace thread`
- session restore provenance: `docs/status/20260417-reset-aware-recommendation-restart-actions.md`

## Remote Session Control Contract
- remote-runtime session index: `not-applicable`
- current remote-readiness phase: `not-applicable`
- chosen backend candidate: `none`
- bootstrap/restore provenance: `not-applicable`
- remote mailbox route evidence: `none`

## Safe Execution Kernel Contract
- leader permission bridge contract: `the main agent decides the approved write scope and validation commands`
- permission lattice contract: `writes are limited to src electron docs and must preserve existing account-switching architecture`
- permission classifier contract: `read-only for historical docs and mutable for task-owned implementation files`
- shell adapter contract: `PowerShell commands for validation and repo inspection`
- safe exec wrapper: `apply_patch for edits and npm scripts for deterministic verification`
- path safety contract: `do not write outside the workspace except reading global sure templates and validator`
- implementation-entry enforcement: `implementation remains blocked until this plan is promoted`

## Extension Boundary Kernel Contract
- vendor snapshot manifest: `not-applicable because no vendor import is planned`
- active adoption ledger: `not-applicable`
- plugin helper registry: `none`
- plugin helper policy: `no plugin helpers are introduced by this task`
- metadata hook registry: `none`
- metadata-only observability policy: `use existing logs and tests only`

## Reference Baseline
- Source root: `C:\programo\계정 전환기`
- Frozen external baseline files: `src/core/recommendation.ts`, `src/features/accounts/components/AccountCard.tsx`, `src/features/accounts/actions.ts`, `src/App.tsx`, `electron/main.ts`, `electron/preload.ts`, `electron/preload.cjs`
- Selected import themes: `reset-aware scoring, relative reset-time formatting, desktop restart controls`
- Deferred import themes for follow-up: `more advanced recommendation heuristics beyond the current 5-hour and 1-week windows`
- Acceptance rule: `ship only the user-requested heuristic and restart actions with no unrelated architectural drift`

## Activation Policy Contract
- source group: `local workspace code and local sure artifacts`
- activation policy mode: `local`
- selection owner: `orchestrator`
- conditional activation evidence: `the task touches only the desktop dashboard and restart IPC surfaces`
- runtime phase label: `phase-1 local implementation`
- activation approved runtime slice: `renderer recommendation and display logic plus main-process restart IPC`
- runtime loader follow-up boundary: `no broader runtime-loader work is approved`
- vendor import root: `none`
- reference snapshot policy: `existing source files act as the baseline and are updated in place`
- plugin bridge state: `not-needed`
- plugin bridge necessity evidence: `the task is self-contained inside the workspace`

## Hotfix Route Contract
- hotfix route identity: `not-a-hotfix`
- hotfix auto-trigger signals: `none`
- hotfix deny signals: `the user requested planning-first implementation, not stabilization-only repair`
- hotfix ambiguous-case intercept: `route remains on sure-plan-confirm`
- explicit investigate-plan-implement preemption: `plan-first execution is required`
- hotfix mini-plan fields: `not-applicable`
- hotfix score family: `not-applicable`
- hotfix score owner: `not-applicable`
- hotfix scorecard verdict: `not-applicable`

## Investigation Contract
- investigation trigger evidence: `none because the user asked for plan-and-implement directly and the code anchors are already local`
- investigation route class: `investigation-skipped first-class mode under sure`
- investigation mode default: `internal/local investigation first when investigation is active; this task starts at plan so no separate investigation pass is opened`
- gpt investigation requirement: `required and never replace with local-only fanout when investigation is active; this plan-start route does not open that handoff`
- internal investigation status: `complete enough for planning from local source reads`
- internal investigation artifact: `local code reads in src/core/recommendation.ts src/features/accounts/components/AccountCard.tsx src/App.tsx electron/main.ts`
- internal findings packet: `recommendation currently uses min(primary, secondary) * plan multiplier, reset timestamps already exist on usage snapshots, and restart actions are not yet exposed`
- gpt investigation status: `not-required`
- gpt investigation artifact: `not-required because no investigation-first route was requested`
- external synthesis brief artifact: `not-required`
- external synthesis pass count: `0 because investigation was skipped`
- latest external synthesis artifact: `not-required`
- non-gpt exception evidence: `planning can proceed because the route chain begins at plan and all needed context is local`
- non-gpt exception evidence home: `this draft plan`
- canonical research summary: `not-required because investigation handoff is not active for this task`
- research-summary artifact path: `not-required because no investigation handoff is active`
- research-summary schema replacement: `gpt/browser-backed investigation status, gpt/browser-backed investigation artifact, non-gpt exception evidence, ready-with-completed-gpt-investigation, blocked-missing-gpt-investigation, internal investigation status, internal investigation artifact, internal findings packet, external synthesis brief artifact, external synthesis pass count, latest external synthesis artifact`
- investigation-to-plan handoff rule: `when investigation is active, planning requires a research summary with completed gpt/browser-backed evidence, the current internal findings packet, and the latest required external synthesis pass; this task uses planning-start compensation instead`
- stale-by-input invalidation: `any user change to the heuristic or restart button requirements reopens planning`

## External Plan Intake Contract
- plan origin: `internal sure planning in the current thread`
- origin route class: `sure-plan-confirm`
- origin transcript anchor: `user message requesting 확실하게 계획하고 구현 and the follow-up answers 1/2/3`
- source plan artifact: `this draft plan`
- apply-intent evidence: `the user wants plan approval followed by implementation in the same task`
- external-plan quarantine state: `not-applicable because the plan is authored inside sure`
- sure confirmation required: `true`
- sure review result: `pending until the review artifact passes`
- execution lock state: `locked until sure pass`
- quarantine release source: `docs/plans/20260417-reset-aware-recommendation-restart-actions.md after promote`
- external-plan fallback reason: `none`
- execution-intent intercept route: `sure-plan-confirm`
- implementation-entry gate: `sure plan approval required before implementation`

## Combined Plan-Implementation Intent Contract
- combined intent evidence: `the user explicitly asked to 확실하게 계획하고 구현`
- planning-intent intercept route: `sure-plan-confirm`
- plan-first execution rule: `implementation starts only after an approved sure plan and a passing review artifact exist`
- combined-intent negative evidence: `no instruction asked to skip planning or to publish an unreviewed plan`

## Authority Contract
- planner authority: `gpt-5.4 / xhigh planner-of-record subagent by default`
- planner authority evidence: `strongest-available local planning because outer developer tool policy forbids spawn_agent unless the user explicitly asks for subagents or delegation`
- reviewer authority: `single-agent strongest-available approval review`
- orchestrator authority: `canonical writer and implementation owner`
- reviewer-route evidence: `strongest-available local approval review will decide plan promotion or implementation entry because external Thinking + Expanded and delegated xhigh review are unavailable in this host path`
- approval payload retrieval state: `received`
- delegated review payload state: `blocked-by-host-boundary`
- runtime authority enforcement: `no runtime widening beyond the approved file set`

## Closeout Lifecycle State Contract
- closeout lifecycle state: `draft`
- release-state source: `plan-review artifact plus check_plan_gate promotion`
- correctness evidence state: `pending`
- operational evidence state: `pending`
- performance evidence state: `not-required`
- performance evidence profile: `recommendation heuristic correctness and restart action reachability`
- compat shim policy: `no compatibility shim planned`
- compat evidence state: `not-required`
- artifact cadence policy: `update status after planning, after implementation, and after validation`
- overall release gate: `blocked`
- invalid transition examples: `no implementation start before plan promotion and no completion claim before tests lint build and manual desktop QA`

## Final Emission And Same-Task Loop Contract
- remaining work classification: `planning then implementation then evaluation`
- loop-continuation items: `implement approved reset-aware recommendation logic, reset-time UI, and restart actions after plan promotion`
- external-deferred items: `none`
- same-task loop mode: `active`
- same-task loop count: `0`
- loop re-entry required: `yes until implementation and evaluation are complete`
- loop re-entry route: `implement -> evaluate`
- next route action: `promote approved plan and enter implementation`
- final emission gate decision: `blocked-loop-open`
- final closeout signal state: `forbidden`
- visible defer explanation state: `visible in the sure artifacts and user updates`
- visible defer explanation evidence: `the task is intentionally mid-flight under a plan-first workflow`

## Operational Norm Contract
- sure operational norm tier: `top-operational-norm-in-global-harness-layer`
- weaker global default override rule: `blocked`
- editable global precedence rule: `확실하게 remains the controlling editable-global rule for this task`
- editable global conflict rule: `blocked`
- non-editable policy boundary: `system/developer/tool policy and deeper local repo rules outrank editable-global sure behavior`
- multi-agent default: `required for non-trivial sure work when outer policy allows`
- planner separation default: `required when delegation is allowed`
- reviewer separation default: `required when delegation is allowed`
- verification separation default: `required when delegation is allowed`
- single-agent exception reason: `developer tool policy forbids spawn_agent unless the user explicitly asks for subagents, delegation, or parallel agent work`
- delegation constraint evidence: `host-visible outer policy boundary from the developer tool instructions blocks ordinary sure subagent lanes in this turn`

## Execution Mode Contract
- execution mode vocabulary: `balanced` | `heavy` | `single`
- execution mode requested state: `balanced`
- execution mode effective state: `balanced`
- default execution mode: `balanced`
- explicit heavy mode trigger: `explicit only`
- explicit single mode trigger: `explicit only`
- execution topology: `balanced strongest-available single-lane implementation because delegated lanes are blocked by outer policy`
- balanced lane-count preservation: `keep the ordinary sure lane count in principle and preserve the same scope, but execute sequentially under strongest-available fallback because worker lanes are blocked`
- heavy mode breadth: `widen evidence only when explicitly requested`
- single strongest-available closeout semantics: `not-applicable because requested mode remains balanced`

## Single-Mode Compensation Contract
- single-mode compensation requirement: `not-required`
- single-mode compensation route: `not-required because effective execution mode is balanced`
- single-mode compensation status: `not-required`
- single-mode compensation artifact: `not-required`
- single-mode compensation fallback state: `not-needed`
- single-mode compensation blocking reason: `not-required`
- allowed requirement values: `required` | `not-required`
- allowed status values: `pending` | `complete` | `blocked` | `failed` | `not-required`
- allowed fallback values: `not-needed` | `hard-blocked` | `strongest-available-approved`
- single-mode current-state rule: `the task stays in balanced mode, so GPT Expanded single-mode compensation is not required`

## Delegation Preflight Contract
- delegation policy preflight: `required`
- delegation policy preflight state: `complete and task-start anchored`
- delegation preflight result: `ask-user-first unless clearly-allowed from explicitly authorized active subagent use for this same task frame; this request contains keyword-level sure consent but the outer developer policy still requires an explicit subagent request`
- delegation preflight classifier inputs: `non-trivial multi-file change, sure keyword present, combined plan-and-implement intent present, outer developer tool policy blocks spawn_agent without explicit delegation wording`
- clearly-allowed evidence rule: `clearly-allowed requires explicit same-task authorization evidence for active subagent use in this task frame, and keyword-level sure consent alone does not satisfy clearly-allowed`
- ask-user-first evidence rule: `when explicit subagent authorization is absent, blocked, or ambiguous, the task must map those states to ask-user-first and then record strongest-available fallback evidence`
- delegation confirmation prompt rule: `ask once only when subagent use is necessary and not already clearly allowed`
- user delegation decision state: `no explicit subagent request recorded`
- single-agent fallback consent state: `approved by external policy boundary rather than user preference`
- single-agent entry rule: `single-agent strongest-available is allowed only with explicit user decline when delegation is not used, or with confirmed-subagent-use plus concrete external-boundary evidence and explicit outer policy boundary evidence`
- mid-task surprise fallback rule: `do not newly claim subagent unavailability without the recorded start-of-task boundary evidence`
- post-confirmation external boundary rule: `the developer tool policy remains the active blocker unless the user explicitly asks for subagents or delegation`

## Planning Question Intake Contract
- planning-question intake policy: `ask 3 short pre-draft planning questions before authoring`
- planning-question applicability rule: `applies because the task changes user-visible recommendation behavior and desktop controls`
- planning-question default count: `3-5`
- planning-question shape rule: `short, concrete, one requirement decision per question`
- planning-question skip rule: `skip only when the task is already fully specified and explicit skip evidence is recorded`
- planning-question skip evidence: `skip not used because the user answered three planning questions`
- drafting follow-up question policy: `one bounded round only if blocking ambiguity remains`
- drafting follow-up question budget: `one bounded round with at most 2 short questions`
- drafting follow-up question trigger rule: `only if the current answers still leave a blocking implementation choice unresolved`
- draft-authoring start gate: `blocked until planning intake completes or skip evidence is recorded; satisfied by the user's three answers in this thread`
- ask 3-5 short pre-draft planning questions by default unless the task is clearly unnecessary to query and skip evidence is recorded.
- limit drafting follow-up questions to one round with at most 2 short questions.
- keep draft authoring blocked until intake completes or skip evidence is recorded.

## Planning Readiness Contract
- problem definition: `the app should recommend the most strategically useful account by combining remaining quota with time until the 5-hour and 1-week resets, show those reset times per account, and expose always-visible restart actions after switching`
- decision target: `approve a bounded implementation across recommendation logic, renderer formatting, and restart IPC`
- implementation-ready state: `ready`
- explicit assumptions: `the current usage API keeps returning primaryResetAt and secondaryResetAt ISO timestamps, Windows can relaunch Codex through Electron main-process commands, and the existing UI can fit two more action buttons without structural redesign`
- bounded open questions: `none`
- non-goal evidence: `the user did not ask for new storage, broader auth changes, or a redesign beyond the requested controls`
- validation mapping: `unit tests cover the new recommendation heuristic, lint/build verify code health, and manual desktop QA checks the normal/elevated restart buttons plus reset-time labels`
- implementation handoff: `implementation scope opens only for recommendation.ts tests-first changes, reset-time formatting/card rendering, and preload/main IPC plus restart buttons; everything else stays blocked until a new approved plan or new proof opening rule exists`
- current-state rule: `fill these as current-state values for this draft, not as policy prose.`
- a plan may claim `implementation-ready state: ready` only when the problem definition is concrete, the decision target is specific, and bounded open questions are empty or explicitly non-blocking.

## Investigation-Skipped Compensation Contract
- investigation-skipped applicability: `applies because the route starts at planning`
- compensation rule: `use sharper planning fields and local code-context evidence instead of a separate investigation artifact`
- required compensation fields: `problem definition, decision target, explicit assumptions, bounded open questions, validation mapping, and implementation handoff are all filled concretely in this draft`
- blocked-if-missing rule: `if any compensation field becomes vague or empty, implementation stays blocked`
- investigation current-state rule: `when investigation is skipped, these fields must be concrete current-state values, not placeholders.`
- planning must absorb missing question refinement when investigation is skipped or the user asks to plan and implement immediately.

## Planning Attachment Contract
- planning attachment packet: `draft plan, local AGENTS rules, user answers, local file context, and repo validation commands`
- attachment freshness state: `fresh`
- attachment-required gate: `satisfied`
- attachment evidence: `the draft references the current source files and the local validation matrix from AGENTS.md`
- required attachment contents:
  - draft plan
  - research summary
  - plan rubric/checklist
  - required AGENTS context
- attachment current-state rule: `fill these as current-state values for this draft, not as policy prose.`
- missing or stale attachment packet blocks approval routing and review start.

## Score And Question Governance Contract
- score governance owner: `shared sure readiness governance`
- score family: `planning-readiness`
- score owner: `sure-plan-confirm`
- decision owner: `approval reviewer`
- scale type: `1-5 rubric scores plus route readiness thresholds`
- threshold policy: `plan route requires readiness score >=70 and a passing review`
- decision status: `ready-for-plan`
- confidence tier: `high`
- evidence refs: `user answers on 2026-04-17 and local reads of recommendation.ts AccountCard.tsx App.tsx electron/main.ts`
- schema version: `canonical-schema.json current local version`
- question governance owner: `shared intake plus route-local planning control`
- route question content owner: `sure-plan-confirm`
- route question content policy: `question-light after the initial 3 answers`
- route question library: `problem-definition, formatting-choice, restart-surface-choice`
- route question selector: `the orchestrator used the minimum 3 questions to close blocking choices`
- question-light policy: `implementation and review stay question-light unless new ambiguity appears`
- bounded reopen policy: `at most one additional short clarification round`
- route reopen cap: `1`
- question class: `planning-intake`
- reason code: `user-visible behavior and restart semantics changed`
- blocking flag: `false after the user answers`
- question budget: `3 asked, 0 remaining in the normal path`
- reopen policy: `reopen only for a new blocking change in requirements`
- wait policy: `no waiting because intake is complete`
- question state: `closed`
- route scorecard policy: `pass only when readiness is concrete and bounded`
- route scorecard owner: `approval reviewer`
- route scorecard verdict: `pending until the review artifact is written`
- score governance task clarity note: legacy compatibility evidence only
- governance wording lock: `route-local scorecards stay separate from the shared readiness gate and route-specific score families stay separate under shared question governance`
- shared readiness stays shared while investigate, plan, implement, and diagnose keep separate score families.
- no universal total score may not collapse route-local scorecards into one decision channel.
- route-specific scorecards may keep their own local scale names, but they must still declare `score family` and `score owner`.
- route question library and selector stay route-local and decide when a route-local follow-up may reopen.
- implement and review routes are question-light by default and only reopen on bounded trigger conditions.

## Task-Start Intake Contract
- task-start intake policy: `reuse one shared intake across plan -> implement -> review`
- task clarity score: legacy compatibility evidence only
- intake skip evidence: `not-used because intake was performed`
- task route chain: `plan -> implement -> review`
- readiness axis scores: `goal_output_clarity=90, scope_boundary_clarity=88, verification_clarity=86, context_evidence_clarity=84, constraints_permissions_clarity=80, risk_boundary_clarity=82`
- readiness score: `85`
- readiness blockers: `none after the user answered the planning questions`
- readiness decision: `ready-for-plan`
- route threshold evidence: `investigate>=55, plan>=70, implement>=80, review>=65 and this task clears the plan threshold with 85`
- one shared intake runs once per task and is reused across investigate -> plan -> implement -> review route chains.
- default intake asks 3 short questions before the first route in the chain.

## Quantitative Investigation Contract
- minimum source count: `not-required for skipped investigation route; local planning used 4 primary source files`
- minimum tool mix: `shell reads plus local AGENTS guidance`
- counterexample requirement: `recommendation tests must include at least one case where higher raw remaining is not the best recommendation because reset timing changes the result`
- evidence confidence tier: `medium-high from direct local source reads`
- research completeness score: `not-applicable because no formal investigation route is active`
- handoff gate result: `not-required for the plan-start route`
- investigation handoff stays blocked unless the minimum source count and minimum tool mix are satisfied for the task type.

## Shared Browser Ownership Contract
- shared profile policy: `not-applicable because no browser lane is active`
- leased working-tab policy: `not-applicable`
- completion ownership policy: `not-applicable`
- runtime recovery class: `not-applicable`
- keep one shared profile for login stability.
- keep one leased working tab per run for completion ownership.
- runtime recovery class must distinguish login, selector drift, fallback, and terminal failures explicitly.

## Harness Completion Boundary Contract
- completion domain: `workspace implementation and local desktop verification`
- harness completeness claim: `the task is only complete after local code, docs, and verification artifacts are updated`
- external constraint boundary: `subagent and external browser approval lanes are unavailable under the current outer tool policy path`
- strongest-available release boundary: `local strongest-available review and deterministic validation only`
- pass-with-notes note class: `manual desktop relaunch behavior still needs runtime QA even after automated checks pass`
- transcript anchor evidence: `user request plus the three explicit planning answers in this thread`
- freeform `follow-up` wording is not release authority; unresolved same-task work must either reopen the loop or be justified as visible external defer.

## Subordinate Wait Discipline Contract
- covered lanes: `planner-of-record, approval reviewer, bounded planning helper, bounded read-only fanout helper`
- explicit exemptions: `all subordinate lanes are inactive because outer policy blocks spawn_agent in this task`
- named wait budget or inherited baseline: `one-hour quiet wait baseline would apply if subordinate lanes were active`
- covered-lane wait budget policy: `one-hour quiet wait`
- same-agent re-contact: `would use wait_agent or send_input if a covered lane existed`
- post-contact wait: `would be required before any fallback lane`
- same-role substitute: `forbidden without the full fail-closed sequence`
- healthy-lane silence rule: `healthy-by-default`
- unnecessary liveness ping rule: `do not send status-only pings`
- re-contact trigger rule: `only after explicit unhealthy evidence or the fully exhausted one-hour quiet wait sequence`
- timeout alone: `is never explicit no-response evidence`
- explicit no-response evidence: `must be host-visible if a covered lane is active`
- fallback/new lane rule: `no substitute lane opens early and no lane is active here due to the outer boundary`

## Worker Artifact Output Contract
- goal: `deliver a bounded sure plan that can enter implementation`
- exact scope: `recommendation scoring, reset labels, and restart buttons with IPC support`
- read-only status or write scope: `plan artifact write scope only during planning`
- findings: `reset timestamps already exist and restart actions need new IPC`
- evidence paths: `src/core/recommendation.ts src/features/accounts/components/AccountCard.tsx src/App.tsx electron/main.ts`
- changed files or file references: `docs/plans/drafts/... and docs/plan-reviews/... during planning`
- commands run: `source file reads and check_plan_gate validation/promotion`
- pass/fail status: `pending`
- open risks: `the heuristic must stay understandable and not accidentally recommend a weaker account in clearly worse cases`
- recommended next step: `write the review artifact, validate, promote, then implement with tests first`

## Delegation Hygiene Contract
- read-only fanout: `allowed only if a future explicit delegation request unlocks helper lanes`
- one worker per non-overlapping write-heavy file set: `would apply if delegation becomes available`
- fresh-eyes verification: `desired but blocked by outer policy in this turn`
- same-worker repair: `the orchestrator repairs any validator failures locally`
- no worker-on-worker checking: `enforced`
- no lazy "based on your findings" handoff: `enforced`
- no trivial delegation: `enforced`

## Closeout Reporting Contract
- why this task existed: `the user wants smarter account choice and one-click restart actions after switching`
- approved plan choice: `reset-aware heuristic plus always-visible dual restart actions`
- approved runtime slice summary: `recommendation.ts actions.ts AccountCard.tsx App.tsx desktopApi.ts preload.ts preload.cjs main.ts tests and docs artifacts`
- what changed: `pending implementation`
- blocker/repair loop: `repair validator or test failures before closeout`
- final approval state: `pending until the review passes and promotion succeeds`
- closeout remaining work summary: `implementation and evaluation remain`
- loop/defer summary: `same-task loop stays open until runtime QA is recorded`
- sure closeout precedence: `evaluation artifact over chat summary`
- reporting helper role: `compact scan-first reporting`
- closeout friendliness rule: `final closeout should stay short and user-facing`

## Architecture
- Keep recommendation math inside `src/core/recommendation.ts` so UI only consumes a final recommended account and display helpers.
- Keep time formatting in `src/features/accounts/actions.ts` to avoid presentation logic leaking into core scoring.
- Keep restart side effects in Electron main/preload and expose only typed renderer calls through `DesktopApi`.

## Rollback Plan
- Backup root: `git is unavailable in this workspace, so rollback relies on targeted apply_patch reversal and prior file contents from this thread`
- Rollback manifest path: `docs/status/20260417-reset-aware-recommendation-restart-actions.md`
- Restore action tracking rule: `record whether any rollback was needed in the status artifact`
- Restore command contract: `reverse the edited files with apply_patch if verification fails irrecoverably`

## Phase Exit Rules
- Stop planning only when `python C:\Users\GPUVM\.codex\check_plan_gate.py validate --task-id 20260417-reset-aware-recommendation-restart-actions --draft docs/plans/drafts/20260417-reset-aware-recommendation-restart-actions.md --review docs/plan-reviews/20260417-reset-aware-recommendation-restart-actions.md --approved docs/plans/20260417-reset-aware-recommendation-restart-actions.md` passes and promotion succeeds.
- Stop implementation only when `npm test`, `npm run lint`, and `npm run build` pass and the desktop app verifies both restart buttons plus reset labels manually.
- Reference-only paths remain read-only, bundle-size governance stays explicit, and no implementation begins before the approved artifact exists.
- Covered subordinate lanes would require named wait-budget evidence, but no subordinate lane is active in this strongest-available path.

## Files and Ownership
- Create: `docs/plans/drafts/20260417-reset-aware-recommendation-restart-actions.md`, `docs/plan-reviews/20260417-reset-aware-recommendation-restart-actions.md`, `docs/contracts/20260417-reset-aware-recommendation-restart-actions.md`, `docs/status/20260417-reset-aware-recommendation-restart-actions.md`, `docs/evaluations/20260417-reset-aware-recommendation-restart-actions.md`
- Modify: `src/core/recommendation.ts`, `src/core/__tests__/recommendation.test.ts`, `src/features/accounts/actions.ts`, `src/features/accounts/components/AccountCard.tsx`, `src/App.tsx`, `src/shared/desktopApi.ts`, `electron/preload.ts`, `electron/preload.cjs`, `electron/main.ts`
- Review-only: `docs/plans/20260409-switch-followups.md`, `docs/plan-reviews/20260409-switch-followups.md`, local AGENTS.md

## Task Breakdown
### Task 1
- Task 1 objective: `add reset-aware scoring inputs and test-first recommendation behavior`
- Task 1 files: `src/core/recommendation.ts`, `src/core/__tests__/recommendation.test.ts`
- Task 1 validation: `npm test -- src/core/__tests__/recommendation.test.ts`

### Task 2
- Task 2 objective: `show 5-hour and 1-week reset labels with the requested relative date formatting`
- Task 2 files: `src/features/accounts/actions.ts`, `src/features/accounts/components/AccountCard.tsx`
- Task 2 validation: `npm test`, `npm run build`

### Task 3
- Task 3 objective: `add always-visible normal/elevated restart actions and main-process IPC wiring`
- Task 3 files: `src/App.tsx`, `src/shared/desktopApi.ts`, `electron/preload.ts`, `electron/preload.cjs`, `electron/main.ts`
- Task 3 validation: `npm test`, `npm run build`, `manual desktop QA`

## Validation Strategy
- Automated commands:
  - `npm test`
  - `npm run lint`
  - `npm run build`
- Manual checks:
  - `Launch the desktop app and confirm each account card shows both reset labels in the requested relative format.`
  - `Use the normal restart button and confirm Codex fully exits and relaunches.`
  - `Use the elevated restart button and confirm the elevated relaunch prompt and restart path work as expected on Windows.`

## Risks and Mitigations
- Risk 1: `a new heuristic could over-favor a soon-reset account even when its current quota is too low`
  - Mitigation 1: `cover counterexamples in unit tests and keep the score formula bounded by both remaining quota and reset urgency`
- Risk 2: `elevated relaunch may fail on some machines because of Windows permission prompts`
  - Mitigation 2: `keep error handling explicit in the main process and preserve the normal relaunch button as the safe fallback`

## Open Questions
- Question: `none`
  - Why it matters: `the user already answered the blocking planning questions`
