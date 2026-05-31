# Quickstart: XIRR Calculator

## Run Tests

```sh
npm test
```

Purpose: run automated calculator and validation tests using Node's built-in
test runner.

## Run Locally

```sh
python3 -m http.server 4173 --directory docs
```

Purpose: serve the static GitHub Pages site locally at
`http://localhost:4173`.

## Manual Verification

1. Open `http://localhost:4173`.
2. Enter contribution `20000`, duration `2 years`, annualized return `22`, and
   leave final amount blank.
3. Select monthly frequency and end-of-period timing.
4. Click Calculate and verify the final amount is around `₹5.85L`.
5. Clear annualized return, enter a final amount, click Calculate, and verify
   the app calculates XIRR.
6. Change frequency or timing and verify the result changes.
7. Inspect the page source and verify the SEO title, meta description,
   canonical URL, JSON-LD structured data, guide content, and FAQ content are
   present in the static HTML.

## SEO Asset Verification

```sh
npm test
```

Purpose: runs calculator tests and verifies SEO-critical static assets such as
metadata, structured data, `robots.txt`, and `sitemap.xml`.

## Publish With GitHub Pages

```sh
git push origin main
```

Purpose: push the approved local changes to the GitHub repository's default
branch.

After merge to the default branch, enable Pages with GitHub Actions or configure
the repository Pages source to the `docs/` folder. The included workflow
publishes `docs/` as the static site when Pages is configured for Actions.
