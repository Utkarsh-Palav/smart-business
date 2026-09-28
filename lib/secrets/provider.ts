import { EnvSecretProvider } from "./env";
import { InfisicalSecretProvider } from "./infisical";
import { SecretProvider } from "./types";

let provider: SecretProvider | undefined;

export function getSecretProvider(): SecretProvider {
  if (provider) return provider;

  const mode = process.env.SECRET_PROVIDER ?? "env";

  switch (mode) {
    case "env":
      provider = new EnvSecretProvider();
      break;

    case "infisical":
      provider = new InfisicalSecretProvider();
      break;

    default:
      throw new Error(`Unsupported SECRET_PROVIDER: "${mode}"`);
  }

  return provider;
}
