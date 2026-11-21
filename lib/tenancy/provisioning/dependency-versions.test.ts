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

test("@infisical/sdk is pinned at a version whose Agent Vault API takes projectId", async () => {
  const pinned = minimumVersion(manifest.dependencies["@infisical/sdk"]);

  assert.equal(
    isAtLeast(pinned, [5, 2, 0]),
    true,
    `expected @infisical/sdk >= 5.2.0, found ${pinned.join(".")}`,
  );

  const { InfisicalSDK } = await import("@infisical/sdk");
  const client = new InfisicalSDK({ siteUrl: "https://infisical.invalid" });

  // Agent Vault was added in 5.2.0 and every one of its operations requires a projectId.
  assert.equal(typeof client.agentVault, "function");
  assert.equal(typeof client.agentVault().sessions.create, "function");
});

test("@neon/sdk is pinned at a version that does not finalize snapshot restores by default", async () => {
  const pinned = minimumVersion(manifest.dependencies["@neon/sdk"]);

  assert.equal(
    isAtLeast(pinned, [7, 15, 0]),
    true,
    `expected @neon/sdk >= 7.15.0, found ${pinned.join(".")}`,
  );

  const { createNeonClient } = await import("@neon/sdk");
  const neon = createNeonClient({ apiKey: "synthetic-test-key" });

  // The v7 client adds the organization and incident namespaces and project counting.
  assert.equal("organizations" in neon, true);
  assert.equal(typeof neon.projects.count, "function");
});
