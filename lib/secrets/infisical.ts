import "server-only";

import { InfisicalSDK } from "@infisical/sdk";

import type { SecretProvider } from "./types";

let infisicalClient: InfisicalSDK | undefined;

function getInfisicalClient(): InfisicalSDK {
  if (infisicalClient) {
    return infisicalClient;
  }

  const siteUrl = process.env.INFISICAL_SITE_URL;
  const clientId = process.env.INFISICAL_CLIENT_ID;
  const clientSecret = process.env.INFISICAL_CLIENT_SECRET;

  if (!siteUrl) {
    throw new Error("INFISICAL_SITE_URL is not configured");
  }

  if (!clientId) {
    throw new Error("INFISICAL_CLIENT_ID is not configured");
  }

  if (!clientSecret) {
    throw new Error("INFISICAL_CLIENT_SECRET is not configured");
  }

  infisicalClient = new InfisicalSDK({
    siteUrl,
  });

  return infisicalClient;
}

export class InfisicalSecretProvider implements SecretProvider {
  async getSecret(reference: string): Promise<string> {
    const projectId = process.env.INFISICAL_PROJECT_ID;
    const environment = process.env.INFISICAL_ENVIRONMENT ?? "production";

    if (!projectId) {
      throw new Error("INFISICAL_PROJECT_ID is not configured");
    }

    const client = getInfisicalClient();

    await client.auth().universalAuth.login({
      clientId: process.env.INFISICAL_CLIENT_ID!,
      clientSecret: process.env.INFISICAL_CLIENT_SECRET!,
    });

    const { secretPath, secretName } = splitSecretReference(reference);

    const secret = await client.secrets().getSecret({
      environment,
      projectId,
      secretName,
      secretPath,
    });

    if (!secret.secretValue) {
      throw new Error(
        `Infisical secret "${reference}" returned an empty value`,
      );
    }

    return secret.secretValue;
  }
}

function splitSecretReference(reference: string): {
  secretPath: string;
  secretName: string;
} {
  const normalized = reference.trim();

  if (!normalized) {
    throw new Error("Secret reference cannot be empty");
  }

  const lastSlash = normalized.lastIndexOf("/");

  if (lastSlash === -1) {
    return {
      secretPath: "/",
      secretName: normalized,
    };
  }

  const secretPath = normalized.slice(0, lastSlash) || "/";

  const secretName = normalized.slice(lastSlash + 1);

  if (!secretName) {
    throw new Error(`Invalid Infisical secret reference: "${reference}"`);
  }

  return {
    secretPath,
    secretName,
  };
}
