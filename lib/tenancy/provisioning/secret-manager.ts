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

    await this.ensureFolder(client, projectId, environment, "tenants", "/");
    await this.ensureFolder(client, projectId, environment, tenantKey, "/tenants");

    /**
     * Check whether the secret already exists.
     *
     * Only a confirmed missing-secret response may create
     * a value. Authentication, permission, network, and
     * other Infisical errors propagate normally.
     */
    try {
      await client.secrets().getSecret({
        secretName: "DATABASE_URL",
        projectId,
        environment,
        secretPath,
        viewSecretValue: false,
      });

      await client.secrets().updateSecret("DATABASE_URL", {
        projectId,
        environment,
        secretPath,
        secretValue: databaseUrl,
      });
    } catch (error) {
      /**
       * Missing DATABASE_URL is recoverable after the tenant
       * folders have been ensured above.
       */
      if (!this.isSecretNotFoundError(error)) {
        throw error;
      }

      await client.secrets().createSecret("DATABASE_URL", {
        projectId,
        environment,
        secretPath,
        secretValue: databaseUrl,
      });
    }

    return `${secretPath}/DATABASE_URL`;
  }

  private async ensureFolder(
    client: InfisicalSDK,
    projectId: string,
    environment: string,
    name: string,
    path: string,
  ): Promise<void> {
    const folderOptions = {
      projectId,
      environment,
      path,
      recursive: false,
    };
    const folderExists = async () =>
      (await client.folders().listFolders(folderOptions)).some(
        (folder) => folder.name === name,
      );

    if (await folderExists()) {
      return;
    }

    try {
      await client.folders().create({
        projectId,
        environment,
        path,
        name,
      });
    } catch (error) {
      if (await folderExists()) {
        return;
      }

      throw error;
    }
  }

  private isSecretNotFoundError(error: unknown): boolean {
    return (
      error instanceof Error &&
      error.name === "InfisicalSDKRequestError" &&
      /\[StatusCode=404\]\s+.*\bsecret\b.*\bnot found\b/i.test(
        error.message,
      )
    );
  }
}
