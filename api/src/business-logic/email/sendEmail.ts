import { createTransport, Transporter } from "nodemailer";
import { Email } from "../../models/Email";

let transporter: undefined | Transporter = undefined;

type EmailType = "verificationCode" | "passwordReset";

export const sendEmail = async ({
  email,
  subject,
  text,
  html,
  type,
}: {
  email: string;
  subject: string;
  text?: string;
  html?: string;
  type: EmailType;
}) => {
  if (!transporter) {
    transporter = createTransport({
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text,
      html,
    });
    await Email.create({
      to: email,
      from: process.env.SMTP_USER,
      messageId: info.messageId,
      type,
    }).save();
  } catch (error) {
    console.log(error);
  }
};
