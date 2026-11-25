import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

type Version = [number, number, number];

const manifest = JSON.parse(
  readFileSync(new URL("../../../package.json", import.meta.url), "utf8"),
) as { dependencies: Record<string, string> };

function minimumVersion(range: string | undefined): Version {
  const match = range ? /^[\^~]?(\d+)\.(\d+)\.(\d+)/.exec(range) : null;

  assert.ok(match, `Unsupported dependency range: ${range}`);

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isAtLeast(actual: Version, minimum: Version): boolean {
  for (let index = 0; index < minimum.length; index += 1) {
    if (actual[index] !== minimum[index]) {
      return actual[index] > minimum[index];
    }
  }

  return true;
}

test("@neon/sdk is pinned at a version that exposes neon.request and parseApiPath", async () => {
  const pinned = minimumVersion(manifest.dependencies["@neon/sdk"]);

  assert.equal(
    isAtLeast(pinned, [7, 16, 0]),
    true,
    `expected @neon/sdk >= 7.16.0, found ${pinned.join(".")}`,
  );

  const sdk = await import("@neon/sdk");

  // 7.16.0 added the generic request escape hatch and the parser that guards its path.
  const neon = sdk.createNeonClient({ apiKey: "synthetic-test-key" });
  assert.equal(typeof neon.request, "function");
  assert.equal(typeof sdk.parseApiPath, "function");

  const parsed = sdk.parseApiPath("/projects/synthetic-project/branches");
  assert.equal(parsed.error, undefined);
  assert.deepEqual(parsed.data, ["projects", "synthetic-project", "branches"]);

  const refused = sdk.parseApiPath("/projects/../secrets");
  assert.equal(refused.data, undefined);
  assert.equal(typeof refused.error, "object");
});
