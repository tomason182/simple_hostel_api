import { NodemailerEmailNotificationRepository } from "../notifications/email/NodemailerEmailNotificationRepository.js";

export function createEmailNotification() {
  const nodemailerConfig = {
    host:
      process.env.NODE_ENV === "production"
        ? "smtp.hostinger.com"
        : "smtp.ethereal.email",
    port: process.env.NODE_ENV === "production" ? 465 : 587,
    secure: process.env.NODE_ENV === "production",
    auth: {
      user:
        process.env.NODE_ENV === "production"
          ? process.env.ACCOUNT_USER_PROD
          : process.env.ACCOUNT_USER_DEV,
      pass:
        process.env.NODE_ENV === "production"
          ? process.env.ACCOUNT_PASS_PROD
          : process.env.ACCOUNT_PASS_DEV,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  };

  return new NodemailerEmailNotificationRepository(nodemailerConfig);
}
