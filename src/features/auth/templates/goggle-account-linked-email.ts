export const googleAccountLinkedEmailTemplate = (name: string) => `
  <!DOCTYPE html>
  <html>
    <body>
      <h2>Google account linked successfully</h2>

      <p>Hi ${name},</p>

      <p>
        Your Google account was successfully linked to your Auth Service account.
        You can now sign in using Google.
      </p>

      <p>
        If you didn't make this change, please secure your account immediately
        and contact support.
      </p>

      <p>— Auth Service</p>
    </body>
  </html>
`;
