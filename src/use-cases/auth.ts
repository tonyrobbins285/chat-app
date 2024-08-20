import "server-only";

import {
  ClientError,
  EmailInUseError,
  EmailVerificationError,
  InternalServerError,
  InvalidCredentialsError,
} from "@/lib/errors";
import { generateHashPassword, verifyPassword } from "@/lib/auth/password";
import { sendVerificationEmail } from "@/lib/utils/email";
import { createSession } from "@/lib/auth/session";
import { getUserByEmail } from "@/data-access/user";
import { createAccount, getAccount } from "@/data-access/account";
import { verifyToken } from "@/lib/auth/token";
import { AuthType } from "@/lib/types";
import { ACCOUNT_TYPES } from "@/lib/constants";
import { getNameFromEmail } from "@/lib/utils";

export const signUp = async (inputs: AuthType) => {
  try {
    const { email } = inputs;
    await checkEmailInUseWithCredentials(email);
    const existingUser = await getUserByEmail({ email });
    if (existingUser) {
      const existingAccount = await getAccount({
        where: {
          type: ACCOUNT_TYPES.CREDENTIALS,
          userId: existingUser.id,
        },
      });
      if (existingAccount) throw new EmailInUseError();
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
};

export const checkEmailInUseWithCredentials = async (email: string) => {
  try {
    const existingUser = await getUserByEmail({ email });
    if (existingUser) {
      const existingAccount = await getAccount({
        where: {
          type: ACCOUNT_TYPES.CREDENTIALS,
          userId: existingUser.id,
        },
      });
      if (existingAccount) throw new EmailInUseError();
    }
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to check email:", error);
      throw new InternalServerError("Could not check email.");
    }
  }
};

export const signIn = async (inputs: AuthType) => {
  try {
    const { email } = inputs;

    const user = await getUserByEmail({ email });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    await verifyPassword(inputs);

    return await createSession(user.id);
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to sign up:", error);
      throw new InternalServerError("Could not sign up.");
    }
  }
};

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
    const existingAccount = await getAccount({
      where: {
        type: ACCOUNT_TYPES.CREDENTIALS,
        user: { email: email },
      },
    });
    if (existingAccount) {
      return;
    }

    const hashPassword = await generateHashPassword(password);
    await createAccount({
      data: {
        type: ACCOUNT_TYPES.CREDENTIALS,
        hashPassword,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email, name: getNameFromEmail(email) },
          },
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
