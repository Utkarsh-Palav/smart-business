# Next Product Milestone: Location and Table Management

## Problem and approach

The platform foundation, onboarding, tenant provisioning, and initial-location creation are implemented. The tenant schema already contains `Location` and `Table`, and the control database contains `TableRoute`, but there is no authenticated location/table management API or dashboard workflow. The next vertical slice should make the first outlet operational and create the routing foundation required by QR/NFC ordering.

Implement the feature from the server boundary outward:

1. Resolve the authenticated user's active business membership and tenant safely on every protected endpoint.
2. Add location read/update support and table CRUD within the tenant database.
3. Create and persist a control-plane `TableRoute` when a table is created, with deterministic ownership and public token handling.
4. Add dashboard UI for viewing locations, managing tables, generating/copying table links, and enabling/disabling tables.
5. Add validation, authorization, error responses, and focused tests before connecting later menu/order work.

## Scope

- `GET /api/locations` for the active business, with the current first location included.
- `POST /api/locations` for adding another location.
- `PATCH /api/locations/[locationId]` for editable location details and active/inactive state.
- `GET /api/locations/[locationId]/tables`.
- `POST /api/locations/[locationId]/tables` to create a table and its public route.
- `PATCH /api/locations/[locationId]/tables/[tableId]` for name, capacity, and status.
- `DELETE` or archive semantics only if consistent with the existing status model; do not hard-delete tables that may later have orders.
- Route response containing a public customer URL, never tenant credentials or internal database details.
- Dashboard location/table management UI under the existing three-layer navigation.
- Query hooks and cache invalidation for the existing `features/locations` pattern.
- Focused API/service/schema tests and build/type validation.

## Explicitly out of scope

- Customer menu rendering and cart.
- Ordering, POS, payments, KDS, inventory, or analytics.
- NFC provider integration.
- Physical review-card commerce.
- Final visual polish of unrelated dashboard pages.

## Important implementation notes

- Do not trust a browser-supplied `businessId` without verifying active membership and role.
- Keep tenant database resolution server-only through the existing tenant resolver/client helpers.
- Treat `TableRoute` as control-plane routing metadata and the tenant `Table.publicToken` as the tenant-side table identity; define the relationship explicitly before coding.
- Make table creation idempotency and duplicate names/codes predictable.
- Preserve historical tables by archiving/deactivating instead of destructive deletion once orders can exist.
- Use the existing Zod and Prisma patterns; do not introduce a second data-access style.

## Follow-up sequence

After this milestone is verified:

1. Menu management CRUD and publishing.
2. Public table route and customer menu.
3. Cart and customer ordering.
4. Order management and lifecycle.

