import "dotenv/config";
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
      user: process.env.ACCOUNT_USER,
      pass: process.env.ACCOUNT_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  };

  return new NodemailerEmailNotificationRepository(nodemailerConfig);
}
