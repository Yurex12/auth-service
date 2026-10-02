export const setPasswordEmailTemplate = (name: string, code: string) => `
  <!DOCTYPE html>
  <html>
    <body>
      <h2>Set your account password</h2>

      <p>Hi ${name},</p>

      <p>
        We received a request to set up a password for your account.
        Use the verification code below to continue:
      </p>

      <h1>${code}</h1>

      <p>
        This code will expire in 15 minutes.
      </p>

      <p>
        If you didn't request this, you can safely ignore this email.
      </p>

      <p>— Auth Service</p>
    </body>
  </html>
`;
