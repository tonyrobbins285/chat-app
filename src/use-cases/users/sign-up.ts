import "server-only";

import { createAccount } from "@/data-access/accounts";
import { createUser, getUserByEmail } from "@/data-access/users";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { createHashedPassword } from "@/lib/utils";
import { AuthFormType } from "@/zod/types";
import { createVerifyEmailToken } from "@/data-access/email-token";

export async function signUpUserUseCase(inputs: AuthFormType) {
  const { email, password } = inputs;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { success: false, message: "Email is already in use." };
  }

  const user = await createUser(email);
  const hashedPassword = await createHashedPassword(password);

  const account = await createAccount({
    userId: user.id,
    hashedPassword,
  });

  const { token } = await createVerifyEmailToken(user.id);
  // await sendEmail(
  //   email,
  //   `Verify`,
  //   <VerifyEmail token={token} />
  // );

  return {
    success: true,
    message: "User created successfully.",
    data: { email },
  };
}
