import "server-only";

import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "@/data-access/email-verification-token";
import { getUserByEmail, updateUserVerification } from "@/data-access/users";
import { AuthenticationError, UserDoesNotExistError } from "@/lib/errors";
import { createTransaction } from "@/data-access/utils";
import { sendEmail } from "@/lib/mail";

type verifyEmailUseCaseProps = {
  token: string | undefined;
};

export const verifyEmailUseCase = async ({
  token,
}: verifyEmailUseCaseProps) => {
  if (!token) {
    return;
  }
  const tokenEntry = await getVerifyEmailToken(token);

  if (!tokenEntry) {
    throw new AuthenticationError();
  }

  const userId = tokenEntry.userId;

  await updateUserVerification(userId);
  await deleteVerifyEmailToken(token);

  return {
    message: "Your email has been verified!",
  };
};

export const sendVerificationUseCase = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new UserDoesNotExistError();
  }

  const verificationToken = await createVerifyEmailToken(user.id);
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken.token}`;

  await sendEmail({
    email,
    subject: "Verify your email.",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });

  return {
    message: `Email verification was sent to ${email}`,
  };
};
