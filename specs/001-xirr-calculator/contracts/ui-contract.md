# UI Contract: XIRR Calculator

## Primary Inputs

The page exposes these user-editable controls:

- Contribution amount
- Duration value
- Duration unit: months or years
- Annualized return / XIRR percentage
- Final amount
- Payment frequency: monthly or yearly
- Payment timing: start of period or end of period
- Start date

## Calculate Action

When the user clicks Calculate:

1. The app identifies the blank core field among contribution amount, duration,
   annualized return, and final amount.
2. If exactly one core field is not blank, the app calculates that value.
3. If the input is invalid or ambiguous, the app shows a validation message and
   leaves the previous result cleared.

## Result Contract

A successful result displays:

- The missing field name
- The calculated value formatted for that field
- Total invested
- Estimated gain
- Number of contributions
- Duration label
- Payment frequency
- Payment timing
- Start date
- End date
- Estimate and investment-advice disclaimer

## Error Contract

Validation messages must be plain language. Required messages:

- Leave exactly one of the four main fields empty.
- Enter a positive contribution amount.
- Enter a positive duration.
- Enter an annualized return greater than -100%.
- Enter a positive final amount.
- This target cannot be reached with the selected assumptions.

## Accessibility Contract

- Every input must have a visible label.
- Segmented choices must be keyboard-focusable form controls.
- The result and validation areas must be announced with live regions.
- Text must not overlap at mobile widths.
