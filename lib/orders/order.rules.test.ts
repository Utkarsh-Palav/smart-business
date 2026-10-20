import assert from "node:assert/strict";
import test from "node:test";
import { canTransitionOrderStatus, resolveOrderUnitPrice } from "./order.rules";

test("menu price override takes precedence over location and base prices", () => {
  assert.equal(resolveOrderUnitPrice(1500, 1700, 2000), 1500);
});

test("location price override is used when there is no menu override", () => {
  assert.equal(resolveOrderUnitPrice(null, 1700, 2000), 1700);
});

test("base price is the fallback when no overrides are set", () => {
  assert.equal(resolveOrderUnitPrice(null, null, 2000), 2000);
});

test("order lifecycle permits forward transitions and protects terminal states", () => {
  assert.equal(canTransitionOrderStatus("PENDING", "ACCEPTED"), true);
  assert.equal(canTransitionOrderStatus("READY", "COMPLETED"), true);
  assert.equal(canTransitionOrderStatus("COMPLETED", "PREPARING"), false);
  assert.equal(canTransitionOrderStatus("CANCELED", "ACCEPTED"), false);
});
