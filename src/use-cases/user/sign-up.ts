import "server-only";

import {
  createAccountWithCredentials,
  getCredentialsAccount,
} from "@/data-access/accounts";
import { createUser, getUserByEmail } from "@/data-access/users";
import { createHashedPassword } from "@/lib/utils";
import { AuthFormType } from "@/zod/types";
import { sendEmail } from "@/lib/mail";
import { EmailInUseError } from "@/lib/errors";
import { createTransaction } from "@/data-access/utils";
import { createVerifyEmailToken } from "@/data-access/email-verification-token";
import { User } from "@prisma/client";

export async function signUpUserUseCase(inputs: AuthFormType) {
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

    const verificationToken = await createVerifyEmailToken(user.id);
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken.token}`;

    await sendEmail({
      email,
      subject: "Verify your email.",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
  });

  return {
    message: `Email verification was sent to ${email}`,
  };
}
