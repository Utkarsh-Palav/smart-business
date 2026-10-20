# Codebase Structure

This project uses the Next.js App Router for URLs and separates route entry points, user interface, feature-specific client code, server-side business logic, and infrastructure.

## Current boundaries

```text
app/                 URL routes, layouts, pages, and API route handlers
components/          Reusable visual components grouped by product area
features/             Client-facing feature schemas, types, and data access
  businesses/         Business query hooks, schemas, and types
  locations/          Location and table query hooks, schemas, and types
  menus/              Menu, category, and product query hooks and schemas
lib/                  Server services, shared application logic, and integrations
  api/                 Shared API response and error contracts
  auth/                Authentication and session logic
  business/            Business rules and business operations
  context/             Shared request/business/tenant context
  db/                  Control and tenant Prisma clients
  location/            Location and table operations
  menus/               Menu, category, and product operations
  onboarding/          Onboarding workflow and finalization
  tenancy/             Tenant lookup, clients, and provisioning
prisma/                Control and tenant schemas, configs, and migrations
generated/             Generated Prisma clients; regenerate with package scripts
scripts/               Database seed and maintenance commands
docs/                  Product and engineering documentation
public/                Static assets served by Next.js
```

`app/` is organized around the URLs it exposes. Keep Next.js route files (`page.tsx`, `layout.tsx`, and `route.ts`) in their route folders. Keep route handlers focused on HTTP concerns and delegate business operations to `lib/` services. Do not move route files into an architecture folder that would change their URL.

`features/` contains client-facing feature code such as query hooks, schemas, and types. `lib/` contains server-side operations and shared integrations. Keep feature-specific rules near their domain service; put a helper in a shared `lib/` area only when more than one feature has the same responsibility.

`components/` is for reusable UI. Prefer a product-area folder such as `dashboard/`, `landing/`, or `settings/`; keep a component beside its route only when it is private to that route. Shared primitives belong in `components/ui/`.

## Adding a feature

1. Add the URL and page or API entry point under `app/`.
2. Add reusable UI under the relevant `components/` product area.
3. Add client schemas, query functions, and feature types under `features/<feature>/` as needed.
4. Put domain operations in a domain service under `lib/<feature>/`; reuse shared API, auth, database, and tenant context helpers from their existing `lib/` areas.
5. Add Prisma changes only in the appropriate control or tenant schema and migration directory.
6. Create directories when the first real file for that responsibility is added. Avoid empty placeholder directories and duplicate roots such as `server/` alongside `lib/`.

## File ownership

- Prisma client output under `generated/` is machine-generated. Change the schema or generator configuration, then run `pnpm run generate:controlDB` or `pnpm run generate:tenantDB`; do not edit generated client files directly.
- `scripts/` is for explicit developer or operational commands, not application request logic.
- `docs/` is for product specifications, plans, and architecture notes.
- Keep environment files and credentials out of version control.

## Cleanup rule

Before removing a file, check its imports, dynamic references, framework conventions, package scripts, and documentation references. A route file may be required by its URL even without imports. Preserve product screens and design assets unless the product owner confirms they are obsolete.
