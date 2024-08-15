import "server-only";

import {
  ClientError,
  EmailInUseError,
  EmailVerificationError,
  InternalServerError,
  InvalidCredentialsError,
} from "@/lib/errors";
import {
  generateHashPassword,
  generateSalt,
  verifyPassword,
} from "@/lib/auth/password";
import { sendVerificationEmail } from "@/lib/utils/email";
import { createSession } from "@/lib/auth/session";
import { getUserByEmail } from "@/data-access/user";
import { createAccount, getAccount } from "@/data-access/account";
import { verifyToken } from "@/lib/auth/token";
import { AuthType } from "@/lib/types";

export async function signUp(inputs: AuthType) {
  try {
    const { email } = inputs;
    const user = await getUserByEmail({ email });
    if (user) {
      const account = await getAccount({
        type: "credentials",
        userId: user.id,
      });
      if (account) throw new EmailInUseError();
    }
    await sendVerificationEmail(inputs);
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to sign up:", error);
      throw new InternalServerError("Could not sign in.");
    }
  }
}

export async function signIn(inputs: AuthType) {
  try {
    const { email } = inputs;

    const user = await getUserByEmail({ email });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isCorrectPassword = await verifyPassword(inputs);

    if (!isCorrectPassword) {
      throw new InvalidCredentialsError();
    }

    return await createSession(user.id);
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to sign up:", error);
      throw new InternalServerError("Could not sign up.");
    }
  }
}

export const verifyEmail = async ({ token }: { token: string }) => {
  try {
    const payload = await verifyToken(token, "VERIFICATION");
    const { email, password } = payload;
    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      throw new EmailVerificationError();
    }
    const salt = generateSalt();
    const hashPassword = generateHashPassword(password, salt);

    await createAccount({
      data: {
        type: "credentials",
        salt,
        hashPassword,
        user: {
          connectOrCreate: { where: { email }, create: { email } },
        },
      },
    });
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to verify email:", error);
      throw new InternalServerError("Could not verify email.");
    }
  }
};
