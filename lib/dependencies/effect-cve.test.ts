import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// effect is a transitive dependency (via prisma -> @prisma/config). It carries
// the fix for GHSA-7589-6fvf-x4pw (CVE-2026-121707), a ReDoS in
// Schema.TemplateLiteral that affects versions < 3.22.1.
const FIXED = "3.22.1";
const VULNERABLE = "3.20.0";

const workspaceYaml = readFileSync(
  new URL("../../pnpm-workspace.yaml", import.meta.url),
  "utf8",
);
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

test("effect is pinned to the CVE-fixed version", () => {
  assert.match(workspaceYaml, new RegExp(`^ {2}effect: ${escapeRegExp(FIXED)}$`, "m"));
  assert.ok(lockfileHasPackage("effect", FIXED));
  assert.ok(!lockfileHasPackage("effect", VULNERABLE));
});
