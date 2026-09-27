export const verificationEmailTemplate = (name: string, code: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Verify your email</h2>

        <p>Hi ${name},</p>

        <p>
          Thanks for signing up. Use the verification code below
          to verify your email address:
        </p>

        <h1>${code}</h1>

        <p>This code expires in 15 minutes.</p>

        <p>If you didn't create an account, you can ignore this email.</p>
      </body>
    </html>
  `;
};
