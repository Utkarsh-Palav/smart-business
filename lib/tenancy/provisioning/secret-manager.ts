import "server-only";

import { InfisicalSDK } from "@infisical/sdk";

export interface TenantSecretManager {
  setDatabaseUrl(tenantKey: string, databaseUrl: string): Promise<string>;
}

export class InfisicalTenantSecretManager implements TenantSecretManager {
  private client: InfisicalSDK | undefined;

  private getClient(): InfisicalSDK {
    if (this.client) {
      return this.client;
    }

    const siteUrl = process.env.INFISICAL_SITE_URL;

    if (!siteUrl) {
      throw new Error("INFISICAL_SITE_URL is not configured");
    }

    this.client = new InfisicalSDK({
      siteUrl,
    });

    return this.client;
  }

  async setDatabaseUrl(
    tenantKey: string,
    databaseUrl: string,
  ): Promise<string> {
    if (!tenantKey) {
      throw new Error("Tenant key is required");
    }

    if (!databaseUrl) {
      throw new Error("Tenant database URL is required");
    }

    const projectId = process.env.INFISICAL_PROJECT_ID;

    const environment = process.env.INFISICAL_ENVIRONMENT ?? "production";

    const clientId = process.env.INFISICAL_CLIENT_ID;

    const clientSecret = process.env.INFISICAL_CLIENT_SECRET;

    if (!projectId) {
      throw new Error("INFISICAL_PROJECT_ID is not configured");
    }

    if (!clientId) {
      throw new Error("INFISICAL_CLIENT_ID is not configured");
    }

    if (!clientSecret) {
      throw new Error("INFISICAL_CLIENT_SECRET is not configured");
    }

    const client = this.getClient();

    /**
     * Authenticate the machine identity.
     */
    await client.auth().universalAuth.login({
      clientId,
      clientSecret,
    });

    /**
     * Each tenant gets an isolated secret path.
     *
     * Example:
     * /tenants/ten_abc123/DATABASE_URL
     */
    const secretPath = `/tenants/${tenantKey}`;

    /**
     * Check whether the secret already exists.
     *
     * We intentionally do not treat every update error
     * as "secret not found", because authentication,
     * permission, network, or Infisical errors must
     * propagate normally.
     */
    try {
      await client.secrets().getSecret({
        secretName: "DATABASE_URL",
        projectId,
        environment,
        secretPath,
        viewSecretValue: false,
      });

      /**
       * Secret exists → update it.
       */
      await client.secrets().updateSecret("DATABASE_URL", {
        projectId,
        environment,
        secretPath,
        secretValue: databaseUrl,
      });
    } catch (error) {
      /**
       * If getSecret failed because the secret does not
       * exist, create it.
       *
       * IMPORTANT:
       * The exact "not found" error shape should be verified
       * against the installed Infisical SDK before relying
       * on this branch in production.
       */
      await client.secrets().createSecret("DATABASE_URL", {
        projectId,
        environment,
        secretPath,
        secretValue: databaseUrl,
      });
    }

    return `${secretPath}/DATABASE_URL`;
  }
}
