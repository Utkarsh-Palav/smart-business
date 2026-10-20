# Product implementation status and next slices

## Implemented foundation

- Business onboarding, tenant provisioning, membership checks, and tenant database resolution.
- Location and table management, including active public table routes.
- Menu, category, and product management, menu publishing, and product availability.
- Public QR table menu at `/t/[token]`.
- Public customer table order submission with a cart, server-side validation/pricing, item snapshots, and idempotent retries.
- Authenticated order queue with guarded order status transitions.

## QR table ordering MVP behavior

- Public order requests use `POST /api/public/tables/[token]/orders` and do not require a customer account.
- The route token resolves through the control database. The business, tenant, table, location, and published menu are validated before accepting an order.
- The server derives item names, prices, currency, and totals from the active menu and location availability. Prices follow menu override, location override, then base price.
- Order items preserve product-name and unit-price snapshots. The MVP currently sets discounts and tax to zero because pricing configuration is not implemented.
- An idempotency key and request hash prevent repeated submissions from creating duplicate orders or replaying the same key with changed items.
- Staff use `GET /api/orders` and `PATCH /api/orders/[orderId]`; each request checks membership and tenant access. Allowed transitions are enforced by the service.
- The dashboard queue is at `/orders/queue` and refreshes periodically while open.

## Remaining work before production rollout

1. Apply the new tenant migration `20261019000000_add_order_idempotency` to every active tenant using the established tenant migration workflow.
2. Run an end-to-end check with a real active table: add items, submit once, retry with the same key, verify one order in the queue, and move it through the service statuses.
3. Verify inactive table links and unavailable products are rejected, and verify a staff account without business access cannot read or update orders.
4. Add a shared distributed rate limiter for public order submission before exposing QR ordering broadly. The repository does not currently have a shared rate-limit store; process-local counters would not be reliable across instances.
5. Decide and implement tax, discount, payment, and customer receipt behavior in later slices.

## Suggested next feature slices

1. Improve order operations: filters, order history, cancellation policy, and live updates beyond periodic refresh.
2. Add waiter-assisted ordering using the same order service and snapshots.
3. Add taxes, discounts, payment selection, settlement, and billing before expanding into POS.
4. Add kitchen display workflows and inventory integration after the order lifecycle is established.

See `docs/architecture.md` for code boundaries and `docs/smart-business-product-specification.md` for the full product requirements and roadmap.
