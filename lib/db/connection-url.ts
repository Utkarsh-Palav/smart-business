import "server-only";

const LEGACY_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

/** Keep pg-connection-string's current full-host verification explicit. */
export function normalizePostgresConnectionUrl(connectionString: string) {
  const url = new URL(connectionString);
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("Database connection URL must use PostgreSQL.");
  }

  const sslMode = url.searchParams.get("sslmode")?.toLowerCase();
  if (sslMode && LEGACY_SSL_MODES.has(sslMode)) {
    url.searchParams.set("sslmode", "verify-full");
  }
  return url.toString();
}
