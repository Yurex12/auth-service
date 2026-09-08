export const passwordResetEmailTemplate = (name: string, code: string) => `
  <!DOCTYPE html>
  <html>
    <body>
      <h2>Reset your password</h2>

      <p>Hi ${name},</p>

      <p>
        We received a request to reset your password.
        Use the code below to continue:
      </p>

      <h1>${code}</h1>

      <p>
        This code will expire in 15 minutes.
      </p>

      <p>
        If you didn't request a password reset, you can safely ignore this email.
      </p>

      <p>— Auth Service</p>
    </body>
  </html>
`;
