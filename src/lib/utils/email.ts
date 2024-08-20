import "server-only";

import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { CLIENT_URL } from "@/lib/constants";
import { InternalServerError } from "@/lib/errors";
import { generateToken } from "@/lib/auth/token";

export const sendEmail = async ({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) => {
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
};

export const sendVerificationEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { token } = await generateToken({ email, password }, "VERIFICATION");

    const verificationLink = `${CLIENT_URL}/verify-email?token=${token}`;

    await sendEmail({
      email,
      subject: "Verify your email.",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new InternalServerError("Could not send verification email.");
  }
};
