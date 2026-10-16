import assert from "node:assert/strict";
import test from "node:test";
import {
  createLocationSchema,
  createTableSchema,
  updateLocationSchema,
  updateTableSchema,
} from "./location.schema";

test("location creation accepts valid public details and normalizes URL slug and country", () => {
  const result = createLocationSchema.parse({
    businessId: "biz_1",
    name: "Downtown Cafe",
    slug: "Downtown-Cafe",
    country: "in",
    operatingMode: "DINE_IN",
  });
  assert.equal(result.slug, "downtown-cafe");
  assert.equal(result.country, "IN");
});

test("location creation rejects invalid slugs and unsupported status values", () => {
  assert.equal(createLocationSchema.safeParse({ businessId: "biz_1", name: "Cafe", slug: "has spaces" }).success, false);
  assert.equal(updateLocationSchema.safeParse({ status: "ARCHIVED" }).success, false);
});

test("location and table updates require at least one supported change", () => {
  assert.equal(updateLocationSchema.safeParse({}).success, false);
  assert.equal(updateTableSchema.safeParse({}).success, false);
  assert.equal(updateTableSchema.safeParse({ capacity: 0 }).success, false);
  assert.equal(updateTableSchema.safeParse({ status: "INACTIVE" }).success, true);
});

test("table creation validates capacity and name", () => {
  assert.equal(createTableSchema.safeParse({ name: "Patio 1", capacity: 8 }).success, true);
  assert.equal(createTableSchema.safeParse({ name: "", capacity: 8 }).success, false);
  assert.equal(createTableSchema.safeParse({ name: "Patio 1", capacity: 101 }).success, false);
});
