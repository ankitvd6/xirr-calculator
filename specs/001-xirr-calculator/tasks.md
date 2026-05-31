# Tasks: XIRR Calculator

**Input**: Design documents from `/specs/001-xirr-calculator/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md),
[research.md](./research.md), [data-model.md](./data-model.md),
[contracts/ui-contract.md](./contracts/ui-contract.md)

**Tests**: Required by constitution and feature requirements. Calculator tests
must be written before implementation tasks that satisfy the same story.

**Organization**: Tasks are grouped by user story so each story can be
implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the static app shell, test entrypoint, and publishing
infrastructure.

- [x] T001 Create project ignore rules in `.gitignore`
- [x] T002 Create package scripts for test and local serve in `package.json`
- [x] T003 Create static site directory structure in `docs/` and `docs/src/`
- [x] T004 Create test directory structure in `tests/`
- [x] T005 Create GitHub Pages deployment workflow in `.github/workflows/pages.yml`
- [x] T006 Create project usage and publish instructions in `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add importable module shells and the visible static page skeleton.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T007 Create calculator module exports in `docs/src/calculator.js`
- [x] T008 Create browser UI wiring entrypoint in `docs/src/main.js`
- [x] T009 Create calculator page markup in `docs/index.html`
- [x] T010 Create responsive base styles in `docs/src/styles.css`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Calculate the Missing Value (Priority: P1) MVP

**Goal**: Users can leave any one core field blank and calculate the missing
value.

**Independent Test**: Enter three valid values, leave each core field blank one
at a time, and verify the calculated fourth value appears.

### Tests for User Story 1

- [x] T011 [P] [US1] Add missing final amount tests in `tests/calculator.test.js`
- [x] T012 [P] [US1] Add missing XIRR tests in `tests/calculator.test.js`
- [x] T013 [P] [US1] Add missing contribution amount tests in `tests/calculator.test.js`
- [x] T014 [P] [US1] Add missing duration tests in `tests/calculator.test.js`

### Implementation for User Story 1

- [x] T015 [US1] Implement input parsing and validation in `docs/src/calculator.js`
- [x] T016 [US1] Implement dated cashflow generation in `docs/src/calculator.js`
- [x] T017 [US1] Implement final amount, XIRR, contribution, and duration solvers in `docs/src/calculator.js`
- [x] T018 [US1] Implement value formatting helpers in `docs/src/calculator.js`
- [x] T019 [US1] Run automated US1 tests in `tests/calculator.test.js`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Choose Payment Schedule Assumptions (Priority: P2)

**Goal**: Users can switch monthly/yearly frequency and start/end payment
timing, and calculations reflect those assumptions.

**Independent Test**: Calculate the same visible inputs with different frequency
and timing options and verify the result changes with the selected assumptions.

### Tests for User Story 2

- [x] T020 [P] [US2] Add monthly versus yearly schedule tests in `tests/calculator.test.js`
- [x] T021 [P] [US2] Add start versus end timing tests in `tests/calculator.test.js`

### Implementation for User Story 2

- [x] T022 [US2] Complete frequency and timing schedule behavior in `docs/src/calculator.js`
- [x] T023 [US2] Add frequency and timing controls to `docs/index.html`
- [x] T024 [US2] Bind schedule controls to calculation flow in `docs/src/main.js`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Understand the Result (Priority: P3)

**Goal**: Users receive a clear result breakdown and plain-language validation
messages.

**Independent Test**: Complete a valid calculation and verify all breakdown
fields appear; submit invalid inputs and verify clear errors appear.

### Tests for User Story 3

- [x] T025 [P] [US3] Add validation error tests in `tests/calculator.test.js`
- [x] T026 [P] [US3] Add result breakdown tests in `tests/calculator.test.js`

### Implementation for User Story 3

- [x] T027 [US3] Implement result breakdown fields in `docs/src/calculator.js`
- [x] T028 [US3] Render result and validation states in `docs/src/main.js`
- [x] T029 [US3] Polish responsive result layout in `docs/src/styles.css`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, docs alignment, and static hosting readiness.

- [x] T030 Run full automated test suite for `tests/calculator.test.js`
- [x] T031 Run local static server for `docs/index.html`
- [x] T032 Verify the app in a browser against `specs/001-xirr-calculator/quickstart.md`
- [x] T033 Review docs and commands in `README.md`
- [x] T034 Confirm all Spec Kit tasks are marked complete in `specs/001-xirr-calculator/tasks.md`

---

## Phase 7: SEO & Search Discoverability

**Purpose**: Make the published GitHub Pages site easier for search engines and
social previews to understand.

- [x] T035 Add SEO title, description, canonical URL, robots directive, social metadata, and JSON-LD structured data to `docs/index.html`
- [x] T036 Add crawlable XIRR guide and FAQ content to `docs/index.html`
- [x] T037 Add responsive guide and FAQ styles to `docs/src/styles.css`
- [x] T038 Add crawler discovery assets in `docs/robots.txt`, `docs/sitemap.xml`, and `docs/site.webmanifest`
- [x] T039 Add automated SEO assertions in `tests/seo.test.js`
- [x] T040 Update Spec Kit docs for SEO scope in `specs/001-xirr-calculator/spec.md`, `specs/001-xirr-calculator/plan.md`, and `specs/001-xirr-calculator/tasks.md`
- [x] T041 Run the full automated test suite including calculator and SEO tests
- [x] T042 Verify the updated static page in a browser before publishing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and reuses
  US1 calculation flow.
- **User Story 3 (Phase 5)**: Depends on US1 result objects and can be verified
  after US1.
- **Polish (Phase 6)**: Depends on all selected user stories.
- **SEO (Phase 7)**: Depends on the calculator page structure and publishing
  URL being stable.

### User Story Dependencies

- **User Story 1 (P1)**: MVP, no dependency on other stories.
- **User Story 2 (P2)**: Depends on schedule helpers used by US1.
- **User Story 3 (P3)**: Depends on calculation result and validation output.

### Parallel Opportunities

- T011-T014 can be drafted together because they cover separate solver modes.
- T020-T021 can be drafted together because they cover separate schedule
  assumptions.
- T025-T026 can be drafted together because validation and breakdown assertions
  cover different behavior.
- T035-T038 can be drafted together because metadata, crawlable content, and
  discovery assets are independent static-site changes.

## Implementation Strategy

1. Complete setup and foundational shell.
2. Write US1 tests, then implement the calculation engine.
3. Add schedule assumption coverage and UI bindings.
4. Add explanation and validation polish.
5. Run automated and browser verification before delivery.
