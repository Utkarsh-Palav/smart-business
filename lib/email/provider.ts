import "server-only";
import { EmailProvider } from "./types";
import { ResendEmailProvider } from "./resend";

let emailProvider: EmailProvider | undefined;

export function getEmailProvider(): EmailProvider {
  if (emailProvider) return emailProvider;

  emailProvider = new ResendEmailProvider();

  return emailProvider;
}
