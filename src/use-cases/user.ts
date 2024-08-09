import "server-only";

import {
  createAccountWithCredentials,
  getCredentialsAccount,
} from "@/data-access/accounts";
import { createUser, getUserByEmail } from "@/data-access/users";
import { createHashPassword, generateSalt } from "@/lib/utils";
import { SignInType, SignUpType } from "@/zod/types";
import {
  EmailInUseError,
  InputValidationError,
  UserDoesNotExistError,
} from "@/lib/errors";
import { createTransaction } from "@/data-access/utils";
import { User } from "@prisma/client";
import { createSession } from "@/lib/session";
import { createVerifyEmailToken } from "@/data-access/email-verification-token";
import { sendEmail } from "@/lib/mail";
import { CLIENT_URL } from "@/lib/constants";

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

    const salt = generateSalt();

    const hashPassword = await createHashPassword(password, salt);

    await createAccountWithCredentials(
      {
        userId: user.id,
        hashPassword,
        salt,
      },
      tx,
    );

    const verificationToken = await createVerifyEmailToken(user.id, tx);
    const verificationLink = `${CLIENT_URL}/verify-email?token=${verificationToken.token}&userId=${user.id}`;

    await sendEmail({
      email,
      subject: "Verify your email.",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
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

  const hash = await createHashPassword(password, account.salt!);

  return hash === account.hashPassword;
}
