"use server";
import { SignInType } from "@/types/authTypes";
import bcrypt from "bcryptjs";
import {
  ClientError,
  InternalServerError,
  InvalidCredentialsError,
} from "@/lib/errors";
import { getUserByEmail } from "@/data-access/user";
import { getAccount } from "@/data-access/account";

export const generateHashPassword = (
  plaintextPassword: string,
  salt: string,
) => {
  return bcrypt.hashSync(plaintextPassword, salt);
};

export const generateSalt = () => {
  return bcrypt.genSaltSync(10);
};

export async function verifyPassword(inputs: SignInType) {
  try {
    const { email, password } = inputs;

    const user = await getUserByEmail({ email });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const account = await getAccount({ type: "credentials", userId: user.id });

    if (!account) {
      throw new InvalidCredentialsError();
    }

    const hash = generateHashPassword(password, account.salt!);

    return hash === account.hashPassword;
  } catch (error) {
    if (error instanceof ClientError) {
      throw error;
    } else {
      console.error("Failed to verify password:", error);
      throw new InternalServerError("Could not verify password.");
    }
  }
}
