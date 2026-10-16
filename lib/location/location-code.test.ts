import assert from "node:assert/strict";
import test from "node:test";
import { normalizeTableCode } from "./location-code";

test("table codes are stable across casing and whitespace variations", () => {
  assert.equal(normalizeTableCode(" Patio  Table 1 "), "patio-table-1");
  assert.equal(normalizeTableCode("patio-table 1"), "patio-table-1");
});

test("table codes normalize common accented characters", () => {
  assert.equal(normalizeTableCode("Café No. 2"), "cafe-no-2");
});
