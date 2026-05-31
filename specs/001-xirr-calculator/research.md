# Research: XIRR Calculator

## Decision: Static dependency-light web app

**Rationale**: GitHub Pages hosts static HTML, CSS, and JavaScript directly from
a repository. A no-build app keeps publishing simple, avoids dependency setup,
and satisfies the user's free-hosting goal.

**Alternatives considered**:

- React + Vite: good maintainability but adds install/build dependencies that
  are not needed for a one-page calculator.
- Single HTML file: simplest hosting, but harder to test and maintain than
  small ES modules.

## Decision: Use dated cashflows for XIRR behavior

**Rationale**: XIRR is annualized return over actual dates. The app will generate
cashflow dates from the user's frequency and timing choices, then solve annual
return against those dates.

**Alternatives considered**:

- CAGR-only formula: simpler but wrong for repeated contributions.
- Periodic IRR only: works for fixed intervals but hides why monthly and yearly
  schedules differ.

## Decision: Bisection-based numeric solver

**Rationale**: Bisection is slower than Newton-Raphson but more stable for
personal finance inputs and avoids derivative edge cases. The expected input
size is tiny, so speed is not a concern.

**Alternatives considered**:

- Newton-Raphson only: faster but can diverge with poor guesses or unusual
  cashflows.
- Closed-form formulas only: possible for some modes but not reliable for all
  XIRR/date-based scenarios.

## Decision: Whole-period duration output

**Rationale**: Regular SIP schedules happen in whole monthly or yearly payments.
When duration is the missing value, the app will report the first whole period
count that reaches the target and show the equivalent years/months.

**Alternatives considered**:

- Fractional duration only: mathematically neat but less practical for payment
  schedules.
- Reject duration solving: would break the user's "any three get the fourth"
  requirement.

## Decision: Publish `docs/` through GitHub Pages

**Rationale**: GitHub Pages can publish static files from a repository. Keeping
the app in `docs/` makes the deploy artifact obvious and keeps Spec Kit files
outside the public app unless intentionally linked.

**Alternatives considered**:

- Publish repository root: exposes project internals as site files.
- Build to `dist/`: unnecessary without a bundler.
