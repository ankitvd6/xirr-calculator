const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const CORE_FIELDS = [
  "contributionAmount",
  "durationValue",
  "annualReturnPercent",
  "finalAmount"
];

const FIELD_LABELS = {
  contributionAmount: "Required contribution",
  durationValue: "Required duration",
  annualReturnPercent: "Required XIRR",
  finalAmount: "Estimated final amount"
};

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function parseNumber(value) {
  if (isBlank(value)) {
    return null;
  }

  const normalized = String(value).replace(/[₹,%\s]/g, "").replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : Number.NaN;
}

function parseDate(value) {
  if (isBlank(value)) {
    return new Date();
  }

  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error("Enter a valid start date.");
  }

  return new Date(Date.UTC(year, month - 1, day));
}

function daysInMonth(year, monthIndex) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function addMonths(date, months) {
  const startYear = date.getUTCFullYear();
  const startMonth = date.getUTCMonth();
  const startDay = date.getUTCDate();
  const targetMonthIndex = startMonth + months;
  const targetYear = startYear + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const targetDay = Math.min(startDay, daysInMonth(targetYear, targetMonth));

  return new Date(Date.UTC(targetYear, targetMonth, targetDay));
}

function addPeriods(date, periodCount, frequency) {
  return addMonths(date, periodCount * periodMonths(frequency));
}

function periodMonths(frequency) {
  return frequency === "monthly" ? 1 : 12;
}

function normalizeFrequency(value) {
  if (value !== "monthly" && value !== "yearly") {
    throw new Error("Choose monthly or yearly payment frequency.");
  }
  return value;
}

function normalizeTiming(value) {
  if (value !== "start" && value !== "end") {
    throw new Error("Choose start or end payment timing.");
  }
  return value;
}

function normalizeDurationUnit(value) {
  if (value !== "months" && value !== "years") {
    throw new Error("Choose months or years for duration.");
  }
  return value;
}

function durationToPeriods(durationValue, durationUnit, frequency) {
  const durationMonths =
    durationUnit === "years" ? durationValue * 12 : durationValue;
  const count = Math.ceil(durationMonths / periodMonths(frequency) - 1e-9);

  if (!Number.isFinite(count) || count <= 0) {
    throw new Error("Enter a positive duration.");
  }

  return count;
}

function formatDuration(periodCount, frequency) {
  const totalMonths = periodCount * periodMonths(frequency);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return `${years} ${years === 1 ? "year" : "years"} ${months} ${
      months === 1 ? "month" : "months"
    }`;
  }

  if (years > 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  return `${months} ${months === 1 ? "month" : "months"}`;
}

function formatDateLabel(date) {
  return `${date.getUTCDate()} ${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function yearFraction(startDate, endDate) {
  return (endDate.getTime() - startDate.getTime()) / DAY_MS / 365;
}

function buildSchedule({ periodCount, frequency, timing, startDate }) {
  const endDate = addPeriods(startDate, periodCount, frequency);
  const contributionDates = [];

  for (let index = 0; index < periodCount; index += 1) {
    const offset = timing === "start" ? index : index + 1;
    contributionDates.push(addPeriods(startDate, offset, frequency));
  }

  return {
    frequency,
    timing,
    startDate,
    endDate,
    periodCount,
    contributionDates
  };
}

function futureValueForSchedule(contributionAmount, annualRate, schedule) {
  return schedule.contributionDates.reduce((total, contributionDate) => {
    const yearsToGrow = yearFraction(contributionDate, schedule.endDate);
    return total + contributionAmount * (1 + annualRate) ** yearsToGrow;
  }, 0);
}

function cashflowsForSchedule(contributionAmount, finalAmount, schedule) {
  const flows = schedule.contributionDates.map((date) => ({
    date,
    amount: -contributionAmount,
    kind: "contribution"
  }));

  flows.push({
    date: schedule.endDate,
    amount: finalAmount,
    kind: "finalValue"
  });

  return flows;
}

function xnpv(rate, cashflows) {
  const baseDate = cashflows[0].date;

  return cashflows.reduce((total, cashflow) => {
    const years = yearFraction(baseDate, cashflow.date);
    return total + cashflow.amount / (1 + rate) ** years;
  }, 0);
}

function solveXirr(cashflows) {
  let lower = -0.999999;
  let upper = 10;
  let lowerValue = xnpv(lower, cashflows);
  let upperValue = xnpv(upper, cashflows);

  for (let attempt = 0; attempt < 20 && lowerValue * upperValue > 0; attempt += 1) {
    upper = upper * 2 + 1;
    upperValue = xnpv(upper, cashflows);
  }

  if (lowerValue * upperValue > 0) {
    throw new Error("This target cannot be reached with the selected assumptions.");
  }

  for (let index = 0; index < 120; index += 1) {
    const middle = (lower + upper) / 2;
    const middleValue = xnpv(middle, cashflows);

    if (Math.abs(middleValue) < 0.000001) {
      return middle;
    }

    if (lowerValue * middleValue <= 0) {
      upper = middle;
      upperValue = middleValue;
    } else {
      lower = middle;
      lowerValue = middleValue;
    }
  }

  return (lower + upper) / 2;
}

function validateInput(input) {
  const missingFields = CORE_FIELDS.filter((field) => isBlank(input[field]));
  if (missingFields.length !== 1) {
    throw new Error("Leave exactly one of the four main fields empty.");
  }

  const missingField = missingFields[0];
  const frequency = normalizeFrequency(input.frequency || "monthly");
  const timing = normalizeTiming(input.timing || "end");
  const durationUnit = normalizeDurationUnit(input.durationUnit || "years");
  const startDate = parseDate(input.startDate);

  const contributionAmount = parseNumber(input.contributionAmount);
  const durationValue = parseNumber(input.durationValue);
  const annualReturnPercent = parseNumber(input.annualReturnPercent);
  const finalAmount = parseNumber(input.finalAmount);

  if (
    missingField !== "contributionAmount" &&
    (!Number.isFinite(contributionAmount) || contributionAmount <= 0)
  ) {
    throw new Error("Enter a positive contribution amount.");
  }

  if (
    missingField !== "durationValue" &&
    (!Number.isFinite(durationValue) || durationValue <= 0)
  ) {
    throw new Error("Enter a positive duration.");
  }

  if (
    missingField !== "annualReturnPercent" &&
    (!Number.isFinite(annualReturnPercent) || annualReturnPercent <= -100)
  ) {
    throw new Error("Enter an annualized return greater than -100%.");
  }

  if (
    missingField !== "finalAmount" &&
    (!Number.isFinite(finalAmount) || finalAmount <= 0)
  ) {
    throw new Error("Enter a positive final amount.");
  }

  return {
    missingField,
    contributionAmount,
    durationValue,
    durationUnit,
    annualReturnPercent,
    finalAmount,
    frequency,
    timing,
    startDate
  };
}

function buildResult({
  missingField,
  calculatedValue,
  contributionAmount,
  finalAmount,
  schedule,
  cashflows
}) {
  const totalInvested = contributionAmount * schedule.periodCount;
  const resolvedFinalAmount =
    missingField === "finalAmount" ? calculatedValue : finalAmount;

  return {
    missingField,
    missingFieldLabel: FIELD_LABELS[missingField],
    calculatedValue,
    totalInvested,
    estimatedGain: resolvedFinalAmount - totalInvested,
    periodCount: schedule.periodCount,
    durationLabel: formatDuration(schedule.periodCount, schedule.frequency),
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    startDateLabel: formatDateLabel(schedule.startDate),
    endDateLabel: formatDateLabel(schedule.endDate),
    frequency: schedule.frequency,
    timing: schedule.timing,
    frequencyLabel: schedule.frequency === "monthly" ? "Monthly" : "Yearly",
    timingLabel:
      schedule.timing === "start" ? "Start of period" : "End of period",
    cashflows,
    warnings: ["Estimate only. This is not investment advice."]
  };
}

function solveDuration({ contributionAmount, annualReturnPercent, finalAmount, frequency, timing, startDate }) {
  const annualRate = annualReturnPercent / 100;
  const maxPeriods = frequency === "monthly" ? 1200 : 100;

  for (let periodCount = 1; periodCount <= maxPeriods; periodCount += 1) {
    const schedule = buildSchedule({ periodCount, frequency, timing, startDate });
    const value = futureValueForSchedule(contributionAmount, annualRate, schedule);

    if (value >= finalAmount) {
      return schedule;
    }
  }

  throw new Error("This target cannot be reached with the selected assumptions.");
}

export function calculateMissingValue(input) {
  const validated = validateInput(input);
  const annualRate = validated.annualReturnPercent / 100;

  if (validated.missingField === "durationValue") {
    const schedule = solveDuration(validated);
    const cashflows = cashflowsForSchedule(
      validated.contributionAmount,
      validated.finalAmount,
      schedule
    );

    return buildResult({
      missingField: validated.missingField,
      calculatedValue: schedule.periodCount,
      contributionAmount: validated.contributionAmount,
      finalAmount: validated.finalAmount,
      schedule,
      cashflows
    });
  }

  const periodCount = durationToPeriods(
    validated.durationValue,
    validated.durationUnit,
    validated.frequency
  );
  const schedule = buildSchedule({
    periodCount,
    frequency: validated.frequency,
    timing: validated.timing,
    startDate: validated.startDate
  });

  if (validated.missingField === "finalAmount") {
    const calculatedFinalAmount = futureValueForSchedule(
      validated.contributionAmount,
      annualRate,
      schedule
    );
    const cashflows = cashflowsForSchedule(
      validated.contributionAmount,
      calculatedFinalAmount,
      schedule
    );

    return buildResult({
      missingField: validated.missingField,
      calculatedValue: calculatedFinalAmount,
      contributionAmount: validated.contributionAmount,
      finalAmount: calculatedFinalAmount,
      schedule,
      cashflows
    });
  }

  if (validated.missingField === "annualReturnPercent") {
    const cashflows = cashflowsForSchedule(
      validated.contributionAmount,
      validated.finalAmount,
      schedule
    );
    const calculatedAnnualReturn = solveXirr(cashflows) * 100;

    return buildResult({
      missingField: validated.missingField,
      calculatedValue: calculatedAnnualReturn,
      contributionAmount: validated.contributionAmount,
      finalAmount: validated.finalAmount,
      schedule,
      cashflows
    });
  }

  if (validated.missingField === "contributionAmount") {
    const factor = futureValueForSchedule(1, annualRate, schedule);
    if (factor <= 0) {
      throw new Error("This target cannot be reached with the selected assumptions.");
    }

    const contributionAmount = validated.finalAmount / factor;
    const cashflows = cashflowsForSchedule(
      contributionAmount,
      validated.finalAmount,
      schedule
    );

    return buildResult({
      missingField: validated.missingField,
      calculatedValue: contributionAmount,
      contributionAmount,
      finalAmount: validated.finalAmount,
      schedule,
      cashflows
    });
  }

  throw new Error("Unable to calculate the missing value.");
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}
