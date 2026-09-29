export class BusinessError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_INPUT"
      | "BUSINESS_SLUG_EXISTS"
      | "OWNER_ROLE_NOT_FOUND"
      | "STARTER_PLAN_NOT_FOUND"
      | "USER_NOT_FOUND"
      | "BUSINESS_CREATION_FAILED",
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "BusinessError";
  }
}
