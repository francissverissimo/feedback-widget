import nodemailer from "nodemailer";
import { MailAdapter, SendMailData } from "../mail-adapter";

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "7bbccb12ce8f4d",
    pass: "6d577a5d02fc8d",
  },
});

export class NodemailerMailAdapter implements MailAdapter {
  async sendMail({ subject, body }: SendMailData) {
    await transport.sendMail({
      from: "Equipe Feedget<oi@feedget.com>",
      to: "Francis S. Verissimo <francissv97@gmail.com>",
      subject,
      html: body,
    });
  }
}
