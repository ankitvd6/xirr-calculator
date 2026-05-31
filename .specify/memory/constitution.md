<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Placeholder Principle 1 -> Static-First Delivery
- Placeholder Principle 2 -> Calculation Correctness
- Placeholder Principle 3 -> Clear User Inputs
- Placeholder Principle 4 -> Test-First Core Logic
- Placeholder Principle 5 -> GitHub Pages Readiness
Added sections:
- Product Constraints
- Development Workflow
Removed sections:
- Placeholder additional constraints
- Placeholder workflow notes
Templates requiring updates:
- .specify/templates/plan-template.md: reviewed, no change required
- .specify/templates/spec-template.md: reviewed, no change required
- .specify/templates/tasks-template.md: reviewed, no change required
Follow-up deferred items: none
-->

# XIRR Calculator Constitution

## Core Principles

### I. Static-First Delivery
The product MUST be deployable as a static website using HTML, CSS, and
JavaScript assets. Any backend, account system, server-side storage, or paid
hosting dependency requires a documented plan violation and a simpler
alternative analysis.

Rationale: the intended hosting target is free GitHub Pages, and all
calculation data can be processed in the browser.

### II. Calculation Correctness
Financial calculations MUST be deterministic, documented, and covered by tests.
The app MUST state the assumptions used for contribution frequency, contribution
timing, duration, and annualized return. Solvers MUST reject impossible or
ambiguous inputs rather than silently producing misleading numbers.

Rationale: users may rely on outputs for personal planning, so correctness and
clear assumptions matter more than clever presentation.

### III. Clear User Inputs
The primary workflow MUST let a user provide exactly three of the four core
values: contribution amount, duration, annualized return, and final value. The
missing value MUST be obvious before calculation, and validation errors MUST use
plain language.

Rationale: the user should not need to understand XIRR terminology deeply to
complete the calculator flow.

### IV. Test-First Core Logic
Calculation and validation behavior MUST be specified with automated tests
before UI polish is considered complete. Tests MUST cover normal cases,
boundary cases, invalid input, monthly frequency, yearly frequency, start-of-
period timing, and end-of-period timing.

Rationale: UI-only validation is not enough for financial math.

### V. GitHub Pages Readiness
Every completed feature MUST preserve direct GitHub Pages publishability.
Repository documentation MUST explain how to run, test, and publish the static
site. A completed change MUST include a repeatable local verification path.

Rationale: the app is intended for a public GitHub repository and free static
hosting.

## Product Constraints

- Calculations MUST run locally in the browser.
- The app MUST NOT require login, cookies, analytics, brokerage access, or
  personal data upload for the MVP.
- INR display MUST be the default, while calculation logic MUST remain currency
  agnostic.
- The UI MUST work on current mobile and desktop browsers.
- The app MUST explain that calculated returns are estimates, not investment
  advice.

## Development Workflow

- Spec Kit artifacts are authoritative: `spec.md` defines user value,
  `plan.md` defines technical design, and `tasks.md` defines implementation
  order.
- Implementation MUST follow `tasks.md` phase order and mark completed tasks.
- Calculation tests MUST run before claiming implementation complete.
- Local browser verification MUST be performed before delivery when frontend UI
  changes are made.
- Remote-changing Git actions, including push and pull request creation, require
  explicit user approval.

## Governance

This constitution supersedes conflicting project guidance for this repository.
Amendments require updating this file, adding a Sync Impact Report, and checking
the spec, plan, and task templates for alignment. Versioning follows semantic
versioning: MAJOR for breaking governance changes, MINOR for new or materially
expanded principles, and PATCH for clarifications.

All specs, plans, tasks, and implementation summaries MUST identify any
constitution violations and their justification. Unjustified violations block
implementation.

**Version**: 1.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-05-30
