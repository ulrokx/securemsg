export const verificationCodeEmail = (code: number) => {
  return `
    <div>
      <h1>Verification Code for SecureMSG</h1>
      <p>Your verification code is ${code}. If you did not register for an account, you can safely ignore this email.</p>
    </div>
  `;
}