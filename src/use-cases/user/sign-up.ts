import "server-only";

import { createAccount } from "@/data-access/accounts";
import { createUser, getUserByEmail } from "@/data-access/users";
import { createHashedPassword } from "@/lib/utils";
import { AuthFormType } from "@/zod/types";
import { createVerifyEmailToken } from "@/data-access/email-token";
import { sendEmail } from "@/lib/mail";
import { EmailInUseError } from "@/lib/errors";
import { createTransaction } from "@/data-access/utils";

export async function signUpUserUseCase(inputs: AuthFormType) {
  const { email, password } = inputs;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new EmailInUseError();
  }

  await createTransaction(async (tx) => {
    const user = await createUser(email, tx);
    const hashedPassword = await createHashedPassword(password);

    await createAccount(
      {
        userId: user.id,
        hashedPassword,
      },
      tx,
    );

    const { verificationToken } = await createVerifyEmailToken(user.id);
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken.token}&email=${email}`;

    await sendEmail({
      email,
      subject: "Verify your email.",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
  });

  return {
    message: "Email verification was sent.",
    data: { email },
  };
}
