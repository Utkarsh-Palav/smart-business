import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const nextPackage = require("next/package.json");

// Next.js must stay pinned to the version that fixes the CVEs
// (GHSA-2464-fhr4-w9xw, GHSA-p3m5-59mp-jv5r, GHSA-673q-mjm6-r5xr).
const FIXED_VERSION = "15.5.28";

test("next is pinned to the CVE-fixed version", () => {
  assert.equal(nextPackage.version, FIXED_VERSION);
});
