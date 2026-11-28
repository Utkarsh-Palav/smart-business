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

test("lucide-react is pinned at 1.83.0 with its new icons and redrawn list-clock and party-popper", async () => {
  const pinned = minimumVersion(manifest.dependencies["lucide-react"]);

  assert.equal(
    isAtLeast(pinned, [1, 83, 0]),
    true,
    `expected lucide-react >= 1.83.0, found ${pinned.join(".")}`,
  );

  const lucide = await import("lucide-react");
  const icons = lucide as unknown as Record<string, unknown>;

  // Added in 1.83.0.
  const addedIcons = [
    ["MailSend", "mail-send"],
    ["StairsArrowDownLeft", "stairs-arrow-down-left"],
    ["StairsArrowUpRight", "stairs-arrow-up-right"],
    ["SquareTextAlignBottomCenter", "square-text-align-bottom-center"],
    ["SquareTextAlignBottomLeft", "square-text-align-bottom-left"],
    ["SquareTextAlignBottomRight", "square-text-align-bottom-right"],
    ["ChevronsDownUpOffset", "chevrons-down-up-offset"],
    ["ChevronsRightLeftOffset", "chevrons-right-left-offset"],
    ["BoxingGlove", "boxing-glove"],
    ["Balcony", "balcony"],
  ] as const;

  for (const [name, className] of addedIcons) {
    assert.notEqual(icons[name], undefined, `expected lucide.${name}`);
    assert.match(
      renderToStaticMarkup(
        createElement(icons[name] as Parameters<typeof createElement>[0]),
      ),
      new RegExp(`class="lucide lucide-${className}"`),
    );
  }

  // The list-clock artwork was redrawn in 1.83.0; the old body path is gone.
  const listClock = renderToStaticMarkup(createElement(lucide.ListClock));

  assert.match(listClock, /M17 13\.5v1\.7l1 \.625/);
  assert.doesNotMatch(listClock, /M16 13v2\.2l1\.6 1/);

  // The party-popper artwork was redrawn in 1.83.0; the old body path is gone.
  const partyPopper = renderToStaticMarkup(createElement(lucide.PartyPopper));

  assert.match(partyPopper, /M6\.591 8\.465/);
  assert.doesNotMatch(partyPopper, /M5\.8 11\.3 2 22l10\.7-3\.79/);

  // The removed lab icons are not part of the public package surface.
  for (const name of ["Burger", "CardCredit", "Football", "PacManGhost"]) {
    assert.equal(icons[name], undefined, `unexpected lucide.${name}`);
  }
});
