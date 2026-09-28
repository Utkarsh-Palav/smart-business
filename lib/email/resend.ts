import "server-only";

import { Resend } from "resend";
import { EmailProvider, SendEmailInput } from "./types";

export class ResendEmailProvider implements EmailProvider {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY!;
    const fromEmail = process.env.RESEND_FROM_EMAIL!;

    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    if (!fromEmail) {
      throw new Error("RESEND_FROM_EMAIL is not configured");
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async send(input: SendEmailInput): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.text && {
        text: input.text,
      }),
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
