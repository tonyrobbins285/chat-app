import "server-only";

import {
  createAccountWithCredentials,
  getCredentialsAccount,
} from "@/data-access/accounts";
import { createUser, getUserByEmail } from "@/data-access/users";
import { createHashedPassword } from "@/lib/utils";
import { SignUpType } from "@/zod/types";
import { EmailInUseError } from "@/lib/errors";
import { createTransaction } from "@/data-access/utils";
import { User } from "@prisma/client";
import { sendVerificationUseCase } from "./email-verification";

export async function signUpUserUseCase(inputs: SignUpType) {
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

    const hashedPassword = await createHashedPassword(password);

    await createAccountWithCredentials(
      {
        userId: user.id,
        hashedPassword,
      },
      tx,
    );

    await sendVerificationUseCase(email);
  });
}
