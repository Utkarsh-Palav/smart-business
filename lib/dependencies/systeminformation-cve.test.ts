import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// systeminformation is a transitive dependency (via @dotenvx/dotenvx +
// shadcn). It carries the fix for GHSA-3f7j-7jwc-fxfj
// (CVE-2026-116576), which affects versions < 5.33.16.
const FIXED = "5.33.16";
const VULNERABLE = "5.33.13";

const lockfile = readFileSync(new URL("../../pnpm-lock.yaml", import.meta.url), "utf8");

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True when pnpm-lock.yaml has a resolved package entry for name@version. */
function lockfileHasPackage(name: string, version: string): boolean {
  return new RegExp(`^  ${escapeRegExp(name)}@${escapeRegExp(version)}:`, "m").test(
    lockfile,
  );
}

test("systeminformation is pinned to the CVE-fixed version", () => {
  assert.ok(lockfileHasPackage("systeminformation", FIXED));
  assert.ok(!lockfileHasPackage("systeminformation", VULNERABLE));
});
