import nodemailer from "nodemailer";
import { env } from "@/lib/env";

export async function sendEmail({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: true,
      auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error(
      `SEND EMAIL ERROR: Failed to send email to ${email}. Error: ${error}`,
    );
    throw new Error(`Failed to send email to ${email}`);
  }
}
