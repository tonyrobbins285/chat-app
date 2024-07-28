import { SendEmailError } from "./errors";
import nodemailer from "nodemailer";

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
    // create transporter object
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST as string,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "hieuho285@gmail.com",
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.log(error);
    throw new SendEmailError();
  }
}
