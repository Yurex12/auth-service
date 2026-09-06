export const welcomeEmailTemplate = (name: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Welcome to Auth Service</h2>

        <p>Hi ${name},</p>

        <p>
          Your email has been successfully verified and your account is now active.
        </p>

        <p>
          You can now sign in and start using your account.
        </p>

        <p>Welcome aboard!</p>

        <p>
          — Auth Service
        </p>
      </body>
    </html>
  `;
};
