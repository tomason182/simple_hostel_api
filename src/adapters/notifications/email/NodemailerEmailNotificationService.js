import nodemailer from "nodemailer";

export class NodemailerEmailNotificationService {
  constructor(config) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(to, subject, html, from) {
    try {
      const mailOptions = {
        from,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new Error(`Failed to send email: ${e.message}`);
    }
  }
}
