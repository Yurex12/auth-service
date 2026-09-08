export const passwordChangedEmailTemplate = (name: string) => `
  <!DOCTYPE html>
  <html>
    <body>
      <h2>Your password has been changed</h2>

      <p>Hi ${name},</p>

      <p>
        Your password was successfully changed.
        You can now sign in with your new password.
      </p>

      <p>
        If you didn't make this change, please reset your password immediately
        and contact support.
      </p>

      <p>— Auth Service</p>
    </body>
  </html>
`;
