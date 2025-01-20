import nodemailer from "nodemailer";
import { emailNotificationService } from "../../../core/ports/EmailNotificationService.js";

export class NodemailerEmailNotificationRepository extends emailNotificationService {
  constructor(config) {
    super();
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(to, subject, body, from) {
    try {
      const mailOptions = {
        from,
        to,
        subject,
        html: body,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new Error(`Failed to send email: ${e.message}`);
    }
  }
}
