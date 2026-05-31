# Feature Specification: XIRR Calculator

**Feature Branch**: `codex/001-xirr-calculator`

**Created**: 2026-05-30

**Status**: Draft

**Input**: User description: "Build an XIRR calculator app where users can enter
any three of investment amount, duration, XIRR/annual return, and final amount,
then calculate the missing fourth value. Include monthly and yearly payment
frequency, start/end payment timing, INR defaults, clear breakdown, static
GitHub Pages hosting, and full Spec Kit docs."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calculate the Missing Value (Priority: P1)

A user enters any three of contribution amount, duration, annualized return, and
final amount, leaves the fourth value empty, and receives the missing value after
clicking Calculate.

**Why this priority**: This is the primary value of the app and must work before
any supporting views matter.

**Independent Test**: Can be fully tested by entering three values, leaving each
core field blank one at a time, and verifying the calculated fourth value is
shown with a clear result label.

**Acceptance Scenarios**:

1. **Given** contribution amount, duration, and annualized return are provided,
   **When** the user clicks Calculate, **Then** the app shows the estimated final
   amount and total invested.
2. **Given** contribution amount, duration, and final amount are provided,
   **When** the user clicks Calculate, **Then** the app shows the annualized XIRR
   needed to reach that final amount.
3. **Given** duration, annualized return, and final amount are provided,
   **When** the user clicks Calculate, **Then** the app shows the required
   regular contribution amount.
4. **Given** contribution amount, annualized return, and final amount are
   provided, **When** the user clicks Calculate, **Then** the app shows the
   estimated duration required.

---

### User Story 2 - Choose Payment Schedule Assumptions (Priority: P2)

A user chooses whether contributions happen monthly or yearly and whether each
contribution is made at the start or end of the selected period, so the
calculation reflects the user's investment habit.

**Why this priority**: XIRR depends on cashflow dates; users need simple controls
for the most common schedules.

**Independent Test**: Can be tested by calculating the same values with monthly
and yearly frequency, and with start and end timing, then verifying the result
changes and the selected assumptions are displayed.

**Acceptance Scenarios**:

1. **Given** monthly frequency is selected, **When** the app calculates a result,
   **Then** generated cashflows use monthly contribution dates.
2. **Given** yearly frequency is selected, **When** the app calculates a result,
   **Then** generated cashflows use yearly contribution dates.
3. **Given** start-of-period timing is selected, **When** the app calculates a
   result, **Then** the first contribution occurs at the beginning of the first
   period.
4. **Given** end-of-period timing is selected, **When** the app calculates a
   result, **Then** the first contribution occurs at the end of the first period.

---

### User Story 3 - Understand the Result (Priority: P3)

A user reviews a plain-language breakdown of the result, including total
invested, estimated gain, number of contributions, frequency, timing, and a note
that the result is an estimate rather than investment advice.

**Why this priority**: The user said they are naive with actual calculations, so
the app must make the output understandable and not just display a number.

**Independent Test**: Can be tested by completing a valid calculation and
checking that the result area explains the calculated value and assumptions
without requiring financial terminology knowledge.

**Acceptance Scenarios**:

1. **Given** a valid calculation is complete, **When** the result is displayed,
   **Then** the app shows the calculated missing value, total invested, estimated
   gain, contribution count, frequency, timing, and date range.
2. **Given** invalid or ambiguous inputs are provided, **When** the user clicks
   Calculate, **Then** the app shows a plain-language validation message and does
   not display a misleading result.

---

### Edge Cases

- User fills all four core values instead of leaving exactly one blank.
- User leaves two or more core values blank.
- Contribution amount, final amount, or duration is zero or negative.
- Annualized return is less than or equal to -100%.
- A final amount cannot be reached under the chosen contribution, return, and
  duration assumptions.
- The duration solver would require more than a practical upper bound.
- Monthly or yearly schedules produce different result values for the same
  visible inputs.
- Start-of-period and end-of-period schedules produce different result values.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present four core fields: contribution amount,
  duration, annualized return/XIRR, and final amount.
- **FR-002**: The system MUST require exactly one of the four core fields to be
  empty before calculating.
- **FR-003**: The system MUST calculate final amount when contribution amount,
  duration, and annualized return are provided.
- **FR-004**: The system MUST calculate annualized XIRR when contribution amount,
  duration, and final amount are provided.
- **FR-005**: The system MUST calculate required contribution amount when
  duration, annualized return, and final amount are provided.
- **FR-006**: The system MUST calculate estimated duration when contribution
  amount, annualized return, and final amount are provided.
- **FR-007**: The system MUST let users choose monthly or yearly contribution
  frequency.
- **FR-008**: The system MUST let users choose start-of-period or end-of-period
  contribution timing.
- **FR-009**: The system MUST generate dated cashflows from the selected
  frequency and timing assumptions.
- **FR-010**: The system MUST display INR-formatted values by default.
- **FR-011**: The system MUST show a result breakdown with total invested,
  estimated gain, contribution count, frequency, timing, and date range.
- **FR-012**: The system MUST show plain-language validation errors for missing,
  extra, invalid, or impossible inputs.
- **FR-013**: The system MUST explain that results are estimates and not
  investment advice.
- **FR-014**: The system MUST be publishable as a static website on free GitHub
  Pages from a public repository.
- **FR-015**: The system MUST provide local run, test, and publish instructions.

### Key Entities *(include if feature involves data)*

- **Calculation Input**: The user's entered contribution amount, duration,
  annualized return, final amount, selected frequency, selected timing, and
  start date.
- **Payment Schedule**: The generated list of contribution dates based on the
  selected frequency, timing, duration, and start date.
- **Cashflow**: A dated contribution or final value used for XIRR calculation.
- **Calculation Result**: The calculated missing value plus supporting breakdown
  values, assumptions, and validation state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can calculate each of the four missing values in under one
  minute without reading external documentation.
- **SC-002**: The app rejects ambiguous input states where zero, two, three, or
  four core fields are blank.
- **SC-003**: Automated tests cover all four missing-value modes and both
  frequency options.
- **SC-004**: The app can be opened locally and used without any login, backend,
  or paid service.
- **SC-005**: The published site can be served as static files through GitHub
  Pages.

## Assumptions

- Users are individual investors doing personal return estimates.
- The MVP supports regular monthly or yearly contributions, not arbitrary custom
  dated cashflow entry.
- Duration can be entered as years or months and is converted into whole
  contribution periods.
- When solving duration, the app reports the nearest whole contribution period
  that reaches the target and shows the equivalent years/months.
- The default start date is today, and users may change it if they want the
  generated schedule to begin on another date.
- Results are approximate planning estimates and are not financial advice.
