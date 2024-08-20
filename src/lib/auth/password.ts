import "server-only";

import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data-access/user";
import { getAccount } from "@/data-access/account";
import { AuthType } from "@/lib/types";
import { ACCOUNT_TYPES } from "@/lib/constants";
import { ClientError, InvalidCredentialsError } from "@/lib/errors/client";
import { InternalServerError } from "@/lib/errors/server";

export const generateHashPassword = async (plaintextPassword: string) => {
  return await bcrypt.hash(plaintextPassword, 10);
};

export const verifyPassword = async ({ email, password }: AuthType) => {
  try {
    const user = await getUserByEmail({ email });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const account = await getAccount({
      where: { type: ACCOUNT_TYPES.CREDENTIALS, userId: user.id },
    });

    if (!account) {
      throw new InvalidCredentialsError();
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      account.hashPassword!,
    );

    if (!isCorrectPassword) {
      throw new InvalidCredentialsError();
    }
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to verify password:", error);
      throw new InternalServerError("Could not verify password.");
    }
  }
};
