export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELED";

const allowedTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["ACCEPTED", "CANCELED"],
  ACCEPTED: ["PREPARING", "CANCELED"],
  PREPARING: ["READY", "CANCELED"],
  READY: ["SERVED", "COMPLETED", "CANCELED"],
  SERVED: ["COMPLETED"],
  COMPLETED: [],
  CANCELED: [],
};

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus) {
  return allowedTransitions[from].includes(to);
}

export function resolveOrderUnitPrice(
  menuOverride: number | null,
  locationOverride: number | null,
  basePrice: number,
) {
  return menuOverride ?? locationOverride ?? basePrice;
}
