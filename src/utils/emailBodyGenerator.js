export function confirmationMailBody(firstName, link) {
  const body = `<table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; color: #333;">
    <tr>
      <td align="center" style="padding: 10px 0;">
        <h2 style="color: #007BFF;">Welcome to SimpleHostel!</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; font-size: 1rem; line-height: 1.6;">
        <p>Hi ${firstName},</p>
        <p>Welcome to SimpleHostel! To complete your account setup, please confirm your email address.</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href=${link} target="_blank" style="display: inline-block; padding: 12px 24px; color: #ffffff; background-color: #007BFF; border-radius: 4px; text-decoration: none; font-weight: bold;">Verify My Email</a>
        </p>
        <p>If you didn&apos;t create an account with SimpleHostel, you can ignore this email.</p>
        <p>Thank you for joining us!<br>The SimpleHostel Team</p>
      </td>
    </tr>
  </table>
  `;

  return body;
}

export function resetPasswordBody(firstName, link) {
  const body = `<table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; color: #333;">
  <tr>
    <td align="center" style="padding: 10px 0;">
      <h2 style="color: #007BFF;">Password Reset</h2>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px; font-size: 1rem; line-height: 1.6;">
      <p>Hi ${firstName},</p>
      <p>We've receive a request to reset your password for your SimpleHostel account. No changes to your account have been made yet.</p>
      <p>You can reset your password by clicking in the link bellow:</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href=${link} target="_blank" style="display: inline-block; padding: 12px 24px; color: #ffffff; background-color: #007BFF; border-radius: 4px; text-decoration: none; font-weight: bold;">Reset your password</a>
      </p>
      <p>If you didn&apos;t did not request a new password, please let us know by replaying to this email.</p>
      <p><br>The SimpleHostel Team</p>
    </td>
  </tr>
</table>
`;

  return body;
}

export function bookingConfirmation(name, checkIn, checkOut) {
  const body = `<table align="center width="100% cellpadding="0" style="max-width: 600px; background-color: #fff; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-family: sans-serif, arial; color: #333">
    <tr>
      <th>Hello ${name}! Your reservation is confirmed</th>
    </tr>
    <tr>
      <th>Check-in</th>
      <td>${checkIn}</td>
    </tr>
    <tr>
      <th>Check-out</th>
      <td>${checkOut}</td>
    </tr>
  </table>`;
}
