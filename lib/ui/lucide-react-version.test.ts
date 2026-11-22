import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type Version = [number, number, number];

const manifest = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
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

test("lucide-react is pinned at the release that adds jacket and paint-gun and redraws spray-can", async () => {
  const pinned = minimumVersion(manifest.dependencies["lucide-react"]);

  assert.equal(
    isAtLeast(pinned, [1, 75, 0]),
    true,
    `expected lucide-react >= 1.75.0, found ${pinned.join(".")}`,
  );

  const lucide = await import("lucide-react");

  // Added in 1.75.0.
  assert.notEqual(lucide.Jacket, undefined);
  assert.notEqual(lucide.PaintGun, undefined);

  const jacket = renderToStaticMarkup(createElement(lucide.Jacket));
  const paintGun = renderToStaticMarkup(createElement(lucide.PaintGun));

  assert.match(jacket, /class="lucide lucide-jacket"/);
  assert.match(paintGun, /class="lucide lucide-paint-gun"/);

  // The spray-can artwork was redrawn in 1.75.0; the old body path is gone.
  const sprayCan = renderToStaticMarkup(createElement(lucide.SprayCan));

  assert.match(
    sprayCan,
    /d="M20 20a2 2 0 01-2 2h-4a2 2 0 01-2-2v-9a3 3 0 013-3h2a3 3 0 013 3z"/,
  );
  assert.doesNotMatch(sprayCan, /m19 9 2 2v10c0 \.6-\.4 1-1 1h-6/);
});
