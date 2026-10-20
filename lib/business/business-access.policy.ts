const BUSINESS_MANAGER_ROLES = new Set([
  "owner",
  "admin",
  "business-admin",
  "manager",
  "location-manager",
]);

export type BusinessMembershipAccess = {
  status: string;
  businessStatus: string;
  roleSlug: string | null;
} | null;

export function canReadBusinessLocations(
  membership: BusinessMembershipAccess,
): boolean {
  return Boolean(
    membership &&
      membership.status === "ACTIVE" &&
      membership.businessStatus === "ACTIVE" &&
      membership.roleSlug,
  );
}

export function canManageBusinessLocations(
  membership: BusinessMembershipAccess,
): boolean {
  return Boolean(
    canReadBusinessLocations(membership) &&
      membership?.roleSlug &&
      BUSINESS_MANAGER_ROLES.has(membership.roleSlug),
  );
}
