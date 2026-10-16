const LOCATION_MANAGER_ROLES = new Set([
  "owner",
  "admin",
  "business-admin",
  "manager",
  "location-manager",
]);

export function canReadBusinessLocations(membership: {
  status: string;
  businessStatus: string;
  roleSlug: string | null;
} | null): boolean {
  return Boolean(
    membership &&
      membership.status === "ACTIVE" &&
      membership.businessStatus === "ACTIVE" &&
      membership.roleSlug,
  );
}

export function canManageBusinessLocations(membership: {
  status: string;
  businessStatus: string;
  roleSlug: string | null;
} | null): boolean {
  return Boolean(
    canReadBusinessLocations(membership) &&
      membership?.roleSlug &&
      LOCATION_MANAGER_ROLES.has(membership.roleSlug),
  );
}
