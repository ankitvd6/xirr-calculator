import {
  calculateMissingValue,
  formatCurrency,
  formatPercent
} from "./calculator.js";

const form = document.querySelector("#calculator-form");
const message = document.querySelector("#message");
const result = document.querySelector("#result");
const resetButton = document.querySelector("#reset-button");
const startDate = document.querySelector("#startDate");

startDate.valueAsDate = new Date();

function readForm() {
  const formData = new FormData(form);
  return {
    contributionAmount: formData.get("contributionAmount"),
    durationValue: formData.get("durationValue"),
    durationUnit: formData.get("durationUnit"),
    annualReturnPercent: formData.get("annualReturnPercent"),
    finalAmount: formData.get("finalAmount"),
    frequency: formData.get("frequency"),
    timing: formData.get("timing"),
    startDate: formData.get("startDate")
  };
}

function formatCalculatedValue(calculation) {
  if (calculation.missingField === "annualReturnPercent") {
    return formatPercent(calculation.calculatedValue);
  }
  if (calculation.missingField === "durationValue") {
    return calculation.durationLabel;
  }
  return formatCurrency(calculation.calculatedValue);
}

function renderResult(calculation) {
  message.textContent = "Calculation complete.";
  result.hidden = false;
  result.innerHTML = `
    <div class="result-hero">
      <span>${calculation.missingFieldLabel}</span>
      <strong>${formatCalculatedValue(calculation)}</strong>
    </div>
    <dl class="result-grid">
      <div><dt>Total invested</dt><dd>${formatCurrency(calculation.totalInvested)}</dd></div>
      <div><dt>Estimated gain</dt><dd>${formatCurrency(calculation.estimatedGain)}</dd></div>
      <div><dt>Contributions</dt><dd>${calculation.periodCount}</dd></div>
      <div><dt>Duration</dt><dd>${calculation.durationLabel}</dd></div>
      <div><dt>Frequency</dt><dd>${calculation.frequencyLabel}</dd></div>
      <div><dt>Timing</dt><dd>${calculation.timingLabel}</dd></div>
      <div><dt>Start date</dt><dd>${calculation.startDateLabel}</dd></div>
      <div><dt>End date</dt><dd>${calculation.endDateLabel}</dd></div>
    </dl>
    <p class="disclaimer">Estimate only. This is not investment advice.</p>
  `;
}

function renderError(error) {
  result.hidden = true;
  result.replaceChildren();
  message.textContent = error.message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    renderResult(calculateMissingValue(readForm()));
  } catch (error) {
    renderError(error);
  }
});

resetButton.addEventListener("click", () => {
  form.reset();
  startDate.valueAsDate = new Date();
  result.hidden = true;
  result.replaceChildren();
  message.textContent = "Leave exactly one main field empty, then calculate.";
});
