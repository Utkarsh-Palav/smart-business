import "server-only";
import { SecretProvider } from "./types";

export class EnvSecretProvider implements SecretProvider {
  async getSecret(reference: string): Promise<string> {
    const value = process.env[reference];

    if (!value) {
      throw new Error(`Environment secret "${reference}" is not configured`);
    }

    return value;
  }
}
