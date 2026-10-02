export const passwordSetEmailTemplate = (name: string) => `
  <!DOCTYPE html>
  <html>
    <body>
      <h2>Password added to your account</h2>

      <p>Hi ${name},</p>

      <p>
        A password has been successfully created for your account.
        You can now sign in using either your email and password or Google.
      </p>

      <p>
        If you didn't set up this password, please secure your account immediately
        and contact support.
      </p>

      <p>— Auth Service</p>
    </body>
  </html>
`;
