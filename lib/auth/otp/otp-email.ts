import "server-only";

export function buildOtpEmail(code: string): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: "Your Smart Business verification code",

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>
            Smart Business Verification Code
          </title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background: #f5f7fa;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              max-width: 520px;
              margin: 40px auto;
              padding: 32px;
              background: #ffffff;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            "
          >
            <h1
              style="
                margin: 0 0 12px;
                font-size: 24px;
                color: #111827;
              "
            >
              Smart Business
            </h1>

            <p
              style="
                margin: 0 0 24px;
                color: #4b5563;
                font-size: 15px;
                line-height: 1.6;
              "
            >
              Use the verification code below
              to continue creating your account.
            </p>

            <div
              style="
                margin: 24px 0;
                padding: 18px;
                background: #f3f4f6;
                border-radius: 8px;
                text-align: center;
              "
            >
              <span
                style="
                  font-size: 32px;
                  font-weight: 700;
                  letter-spacing: 8px;
                  color: #111827;
                "
              >
                ${code}
              </span>
            </div>

            <p
              style="
                margin: 0 0 12px;
                color: #4b5563;
                font-size: 14px;
              "
            >
              This code expires in
              <strong>10 minutes</strong>.
            </p>

            <p
              style="
                margin: 0;
                color: #6b7280;
                font-size: 13px;
                line-height: 1.5;
              "
            >
              If you did not request this
              verification code, you can safely
              ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,

    text: `
Smart Business

Your verification code is: ${code}

This code expires in 10 minutes.

If you did not request this verification code,
you can safely ignore this email.
    `.trim(),
  };
}
