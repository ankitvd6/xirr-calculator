# Data Model: XIRR Calculator

## CalculationInput

Represents the user-provided form state.

Fields:

- `contributionAmount`: positive currency amount or blank
- `durationValue`: positive duration number or blank
- `durationUnit`: `months` or `years`
- `annualReturnPercent`: percentage greater than `-100` or blank
- `finalAmount`: positive currency amount or blank
- `frequency`: `monthly` or `yearly`
- `timing`: `start` or `end`
- `startDate`: calendar date used to generate payment dates

Validation rules:

- Exactly one of `contributionAmount`, `durationValue`,
  `annualReturnPercent`, and `finalAmount` must be blank.
- `durationUnit`, `frequency`, `timing`, and `startDate` must always be set.
- Amounts and duration must be positive when provided.
- Annual return must be greater than `-100%` when provided.

## PaymentSchedule

Represents generated contribution dates.

Fields:

- `frequency`
- `timing`
- `startDate`
- `endDate`
- `periodCount`
- `contributionDates`

Validation rules:

- Monthly schedules use one contribution per month.
- Yearly schedules use one contribution per year.
- Start timing contributes at the beginning of each period.
- End timing contributes at the end of each period.

## Cashflow

Represents a single dated amount used for XIRR math.

Fields:

- `date`
- `amount`
- `kind`: `contribution` or `finalValue`

Validation rules:

- Contributions are modeled as negative amounts.
- Final value is modeled as a positive amount on the schedule end date.

## CalculationResult

Represents the solved value and user-facing breakdown.

Fields:

- `missingField`
- `calculatedValue`
- `totalInvested`
- `estimatedGain`
- `periodCount`
- `durationLabel`
- `startDate`
- `endDate`
- `frequency`
- `timing`
- `cashflows`
- `warnings`

State transitions:

```text
empty form -> valid input -> calculated result
empty form -> invalid input -> validation message
calculated result -> edited input -> stale result cleared
```
