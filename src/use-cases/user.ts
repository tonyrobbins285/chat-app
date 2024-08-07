import "server-only";

import {
  createAccountWithCredentials,
  getCredentialsAccount,
} from "@/data-access/accounts";
import { createUser, getUserByEmail } from "@/data-access/users";
import { createHashedPassword, generateUUID } from "@/lib/utils";
import { SignInType, SignUpType } from "@/zod/types";
import { EmailInUseError, InputValidationError } from "@/lib/errors";
import { createTransaction } from "@/data-access/utils";
import { User } from "@prisma/client";
import { sendVerificationUseCase } from "./email-verification";
import { cookies } from "next/headers";
import { createAccessToken, createRefreshToken } from "@/data-access/tokens";
import { REFRESH_TOKEN_TTL } from "@/lib/constants";
import { createSession } from "@/lib/session";

export async function signUpUseCase(inputs: SignUpType) {
  const { email, password } = inputs;
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    const account = await getCredentialsAccount(existingUser.id);
    if (account) throw new EmailInUseError();
  }

  await createTransaction(async (tx) => {
    let user: User;
    if (!existingUser) {
      user = await createUser(email, tx);
    } else {
      user = existingUser;
    }

    const salt = generateUUID();

    const hashedPassword = await createHashedPassword(password, salt);

    await createAccountWithCredentials(
      {
        userId: user.id,
        hashedPassword,
        salt,
      },
      tx,
    );

    await sendVerificationUseCase(email);
  });
}

export async function signInUseCase(inputs: SignInType) {
  const user = await getUserByEmail(inputs.email);

  if (!user) {
    throw new InputValidationError();
  }

  const isCorrectPassword = await verifyPassword(inputs);

  if (!isCorrectPassword) {
    throw new InputValidationError();
  }

  const accessToken = await createSession(user.id);

  return accessToken;
}

export async function verifyPassword(inputs: SignInType) {
  const { email, password } = inputs;

  const user = await getUserByEmail(email);
  if (!user) {
    throw new InputValidationError();
  }

  const account = await getCredentialsAccount(user.id);
  if (!account) {
    throw new InputValidationError();
  }

  const hash = await createHashedPassword(password, account.salt!);

  return hash === account.hashPassword;
}
