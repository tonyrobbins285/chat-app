import "server-only";

import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "@/data-access/email-verification-token";
import {
  getUserByEmail,
  getUserById,
  updateUserVerification,
} from "@/data-access/users";
import { AuthenticationError, UserDoesNotExistError } from "@/lib/errors";
import { sendEmail } from "@/lib/mail";
import { CLIENT_URL } from "@/lib/constants";
import { createSession } from "@/lib/session";

type verifyEmailUseCaseProps = {
  token: string;
  userId: string;
};

export const verifyEmailUseCase = async ({
  token,
  userId,
}: verifyEmailUseCaseProps) => {
  try {
    const user = await getUserById(userId);

    if (user?.emailVerified) {
      return {
        message: "Your email was already verified!",
      };
    }

    const tokenEntry = await getVerifyEmailToken(token);

    if (!tokenEntry) {
      throw new AuthenticationError();
    }

    await updateUserVerification(userId);
    await deleteVerifyEmailToken(token);

    return {
      message: "Your email has been verified!",
    };
  } catch (error) {}
};

export const sendVerificationUseCase = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new UserDoesNotExistError();
  }

  if (user.emailVerified) {
    return {
      message: `Your email is already verified!`,
    };
  }

  const verificationToken = await createVerifyEmailToken(user.id);
  const verificationLink = `${CLIENT_URL}/verify-email?token=${verificationToken.token}`;

  await sendEmail({
    email,
    subject: "Verify your email.",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });

  return {
    message: `Email verification was sent to ${email}`,
  };
};
