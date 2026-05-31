# XIRR Calculator

A static browser app for solving one missing value from regular investments.
Enter any three of contribution amount, duration, annualized return/XIRR, and
final amount, then calculate the fourth.

## Features

- Solve final amount, XIRR, contribution amount, or duration.
- Choose monthly or yearly contribution frequency.
- Choose start-of-period or end-of-period contribution timing.
- See total invested, estimated gain, contribution count, and assumptions.
- Includes static SEO metadata, crawlable guide/FAQ content, sitemap, robots
  file, and structured data for search discovery.
- Runs fully in the browser with no login or backend.

## Run Tests

```sh
npm test
```

Purpose: runs automated calculator and validation tests with Node's built-in
test runner.

## Run Locally

```sh
npm run serve
```

Purpose: serves the static app from `docs/` at `http://localhost:4173`.

## Publish On GitHub Pages

```sh
git push origin main
```

Purpose: pushes the approved local changes to the GitHub repository's default
branch.

Configure GitHub Pages to use GitHub Actions. The included workflow publishes
the `docs/` folder as the site.

GitHub Pages supports static HTML, CSS, and JavaScript files from a repository,
which is why this app does not need a backend.

## Disclaimer

This calculator provides estimates for personal planning. It is not investment
advice.
