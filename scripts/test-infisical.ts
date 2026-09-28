import "dotenv/config";

import { InfisicalSDK } from "@infisical/sdk";

async function main() {
  const siteUrl = process.env.INFISICAL_SITE_URL;
  const projectId = process.env.INFISICAL_PROJECT_ID;
  const environment = process.env.INFISICAL_ENVIRONMENT;
  const clientId = process.env.INFISICAL_CLIENT_ID;
  const clientSecret = process.env.INFISICAL_CLIENT_SECRET;

  if (!siteUrl || !projectId || !environment || !clientId || !clientSecret) {
    throw new Error("Missing Infisical environment configuration");
  }

  const client = new InfisicalSDK({
    siteUrl,
  });

  await client.auth().universalAuth.login({
    clientId,
    clientSecret,
  });

  const secret = await client.secrets().getSecret({
    environment,
    projectId,
    secretName: "DATABASE_URL",
    secretPath: "/tenants/development",
  });

  if (!secret.secretValue) {
    throw new Error("DATABASE_URL was not returned");
  }

  console.log("✅ Infisical authentication: SUCCESS");
  console.log("✅ Secret retrieval: SUCCESS");
  console.log("✅ DATABASE_URL exists: YES");
  console.log("🔒 DATABASE_URL value: [REDACTED]");
}

main().catch((error) => {
  console.error("❌ Infisical test failed");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error");
  }

  process.exit(1);
});