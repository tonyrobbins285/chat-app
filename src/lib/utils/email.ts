import "server-only";

import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { ACCOUNT_TYPES, CLIENT_URL } from "@/lib/constants";
import { InternalServerError } from "@/lib/errors/server";
import { generateToken, verifyToken } from "@/lib/auth/token";
import { getUserByEmail } from "@/data-access/user";
import { ForgotPasswordFormType } from "@/lib/types";
import { getAccount, updateHashPassword } from "@/data-access/account";
import { InvalidTokenError } from "@/lib/errors/client";

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

export const sendResetPassword = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail({ email });

    if (!existingUser) {
      return;
    }

    const { token } = await generateToken({ email }, "RESET");

    const verificationLink = `${CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail({
      email,
      subject: "Verify your email.",
      html: `<p>Click <a href="${verificationLink}">here</a> to reset password.</p>`,
    });
  } catch (error) {
    console.error("Failed to send reset password email:", error);
    throw new InternalServerError("Could not send reset password email.");
  }
};

export const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  try {
    console.log(token);
    const { email } = await verifyToken<ForgotPasswordFormType>(token, "RESET");

    const existingUser = await getUserByEmail({ email });

    if (!existingUser) {
      return;
    }

    const existingAccount = await getAccount({
      where: {
        userId: existingUser.id,
        type: ACCOUNT_TYPES.CREDENTIALS,
      },
    });

    if (!existingAccount) {
      return;
    }

    await updateHashPassword({ userId: existingAccount.userId, password });
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return;
    }
    console.error("Failed to reset password:", error);
    throw new InternalServerError("Could not reset password.");
  }
};
