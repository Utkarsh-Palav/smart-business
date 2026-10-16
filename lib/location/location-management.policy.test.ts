import assert from "node:assert/strict";
import test from "node:test";
import { canManageBusinessLocations, canReadBusinessLocations } from "./location-management.policy";

test("active business owners and managers can read and manage locations", () => {
  for (const roleSlug of ["owner", "manager", "location-manager"]) {
    const membership = { status: "ACTIVE", businessStatus: "ACTIVE", roleSlug };
    assert.equal(canReadBusinessLocations(membership), true);
    assert.equal(canManageBusinessLocations(membership), true);
  }
});

test("active non-manager members can read but cannot change locations", () => {
  const membership = { status: "ACTIVE", businessStatus: "ACTIVE", roleSlug: "staff" };
  assert.equal(canReadBusinessLocations(membership), true);
  assert.equal(canManageBusinessLocations(membership), false);
});

test("inactive memberships, businesses, and missing memberships are denied", () => {
  assert.equal(canReadBusinessLocations({ status: "SUSPENDED", businessStatus: "ACTIVE", roleSlug: "owner" }), false);
  assert.equal(canManageBusinessLocations({ status: "ACTIVE", businessStatus: "SUSPENDED", roleSlug: "owner" }), false);
  assert.equal(canReadBusinessLocations(null), false);
});
