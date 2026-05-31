import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../docs/index.html", import.meta.url), "utf8");
const robots = readFileSync(new URL("../docs/robots.txt", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../docs/sitemap.xml", import.meta.url), "utf8");

test("page includes core SEO metadata", () => {
  assert.match(
    html,
    /<title>Free XIRR Calculator for SIP and Mutual Fund Returns<\/title>/
  );
  assert.match(html, /<meta name="description" content="[^"]{80,160}">/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/ankitvd6\.github\.io\/xirr-calculator\/">/
  );
  assert.match(html, /<meta name="robots" content="index, follow">/);
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta name="twitter:card" content="summary">/);
});

test("page includes crawlable guide and FAQ content", () => {
  assert.match(html, /What is XIRR\?/);
  assert.match(html, /XIRR vs CAGR/);
  assert.match(html, /How do I calculate XIRR for SIP returns\?/);
  assert.match(html, /monthly or yearly/);
});

test("structured data is present and valid JSON", () => {
  const match = html.match(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/
  );

  assert.ok(match, "Expected JSON-LD structured data block");
  const data = JSON.parse(match[1]);
  assert.equal(data["@context"], "https://schema.org");
  assert.ok(data["@graph"].some((item) => item["@type"] === "WebApplication"));
  assert.ok(data["@graph"].some((item) => item["@type"] === "FAQPage"));
});

test("robots and sitemap point to the canonical site", () => {
  assert.match(robots, /User-agent: \*/);
  assert.match(
    robots,
    /Sitemap: https:\/\/ankitvd6\.github\.io\/xirr-calculator\/sitemap\.xml/
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/ankitvd6\.github\.io\/xirr-calculator\/<\/loc>/
  );
});
