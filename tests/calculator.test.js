import test from "node:test";
import assert from "node:assert/strict";

import { calculateMissingValue } from "../docs/src/calculator.js";

const baseInput = {
  contributionAmount: "20000",
  durationValue: "2",
  durationUnit: "years",
  annualReturnPercent: "22",
  finalAmount: "",
  frequency: "monthly",
  timing: "end",
  startDate: "2026-01-01"
};

function calculate(overrides) {
  return calculateMissingValue({ ...baseInput, ...overrides });
}

test("US1 calculates missing final amount", () => {
  const result = calculate({});

  assert.equal(result.missingField, "finalAmount");
  assert.equal(result.periodCount, 24);
  assert.ok(result.calculatedValue > 580000);
  assert.ok(result.calculatedValue < 590000);
  assert.equal(result.totalInvested, 480000);
});

test("US1 calculates missing XIRR", () => {
  const result = calculate({
    annualReturnPercent: "",
    finalAmount: "584600"
  });

  assert.equal(result.missingField, "annualReturnPercent");
  assert.ok(result.calculatedValue > 21.8);
  assert.ok(result.calculatedValue < 22.2);
});

test("US1 calculates missing contribution amount", () => {
  const result = calculate({
    contributionAmount: "",
    finalAmount: "584600"
  });

  assert.equal(result.missingField, "contributionAmount");
  assert.ok(result.calculatedValue > 19900);
  assert.ok(result.calculatedValue < 20100);
});

test("US1 calculates missing duration as whole contribution periods", () => {
  const result = calculate({
    durationValue: "",
    finalAmount: "584600"
  });

  assert.equal(result.missingField, "durationValue");
  assert.equal(result.periodCount, 24);
  assert.equal(result.durationLabel, "2 years");
});

test("US2 monthly and yearly schedules produce different results", () => {
  const monthly = calculate({ frequency: "monthly" });
  const yearly = calculate({ frequency: "yearly" });

  assert.equal(monthly.periodCount, 24);
  assert.equal(yearly.periodCount, 2);
  assert.ok(monthly.calculatedValue > yearly.calculatedValue);
});

test("US2 start timing produces a higher final amount than end timing", () => {
  const end = calculate({ timing: "end" });
  const start = calculate({ timing: "start" });

  assert.ok(start.calculatedValue > end.calculatedValue);
});

test("US3 rejects ambiguous blank fields", () => {
  assert.throws(
    () => calculate({ finalAmount: "600000" }),
    /Leave exactly one of the four main fields empty/
  );

  assert.throws(
    () => calculate({ annualReturnPercent: "", finalAmount: "" }),
    /Leave exactly one of the four main fields empty/
  );
});

test("US3 rejects invalid numeric values", () => {
  assert.throws(
    () => calculate({ contributionAmount: "-1" }),
    /Enter a positive contribution amount/
  );

  assert.throws(
    () => calculate({ annualReturnPercent: "-100" }),
    /Enter an annualized return greater than -100%/
  );
});

test("US3 returns breakdown fields", () => {
  const result = calculate({});

  assert.equal(result.estimatedGain, result.calculatedValue - result.totalInvested);
  assert.equal(result.frequencyLabel, "Monthly");
  assert.equal(result.timingLabel, "End of period");
  assert.equal(result.startDateLabel, "1 Jan 2026");
  assert.equal(result.endDateLabel, "1 Jan 2028");
  assert.ok(result.cashflows.length > 20);
});
