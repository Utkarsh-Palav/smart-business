export class LocationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_LOCATION_INPUT"
      | "TENANT_NOT_ACTIVE"
      | "LOCATION_CREATION_FAILED",
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "LocationError";
  }
}
