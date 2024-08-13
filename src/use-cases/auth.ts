import "server-only";

import {
  ClientError,
  EmailInUseError,
  InternalServerError,
  InvalidCredentialsError,
  TransactionError,
} from "@/lib/errors";
import { CLIENT_URL } from "@/lib/constants";
import {
  generateHashPassword,
  generateSalt,
  verifyPassword,
} from "@/lib/auth/password";
import { sendEmail } from "@/lib/utils/email";
import { createSession } from "@/lib/auth/session";
import { SignInType, SignUpType } from "@/types/authTypes";
import { createTransaction } from "@/lib/utils/transaction";
import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "@/data-access/token";
import { getUserByEmail } from "@/data-access/user";
import { createAccount, getAccount } from "@/data-access/account";

export async function signUp(inputs: SignUpType) {
  try {
    const { email, password } = inputs;
    const user = await getUserByEmail({ email });
    if (user) {
      const account = await getAccount({
        type: "credentials",
        userId: user.id,
      });
      if (account) throw new EmailInUseError();
    }

    await createTransaction(async (tx) => {
      try {
        const salt = generateSalt();
        const hashPassword = generateHashPassword(password, salt);

        await createAccount(
          {
            data: {
              type: "credentials",
              salt,
              hashPassword,
              user: {
                connectOrCreate: { where: { email }, create: { email } },
              },
            },
          },
          tx,
        );

        const verificationToken = await createVerifyEmailToken({ email }, tx);
        const verificationLink = `${CLIENT_URL}/verify-email?token=${verificationToken.token}&email=${email}`;

        await sendEmail({
          email,
          subject: "Verify your email.",
          html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
        });
      } catch (error) {
        console.error("Transaction error during sign up:", error);
        throw new TransactionError("Failed to complete sign up transaction.");
      }
    });
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to sign up:", error);
      throw new InternalServerError("Sign up failed. Please try again.");
    }
  }
}

export async function signIn(inputs: SignInType) {
  try {
    const { email, password } = inputs;

    const user = await getUserByEmail({ email });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isCorrectPassword = await verifyPassword(inputs);

    if (!isCorrectPassword) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await createSession(user.id);

    return accessToken;
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to sign up:", error);
      throw new InternalServerError("Sign up failed. Please try again.");
    }
  }
}

export const verifyEmail = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const user = await getUserById(userId);

    if (user?.emailVerified) {
      return {
        message: "Your email was already verified!",
      };
    }

    const tokenEntry = await getVerifyEmailToken(token);

    if (!tokenEntry) {
      throw new Error("Failed to verify email.");
    }

    await updateUserVerification(userId);
    await deleteVerifyEmailToken(token);

    return {
      message: "Your email has been verified!",
    };
  } catch (error) {
    throw new Error("Failed to verify email.");
  }
};

export const sendVerification = async (email: string) => {
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
