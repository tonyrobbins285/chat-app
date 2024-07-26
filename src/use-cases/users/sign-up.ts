import { createAccount } from "@/data-access/accounts";
import { createUser, getUserByEmail } from "@/data-access/users";
import { EmailInUseError } from "@/lib/errors";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { createHashedPassword } from "@/lib/utils";
import { AuthFormType } from "@/zod/types";

export async function signUpUserUseCase(inputs: AuthFormType) {
  const { email, password } = inputs;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { success: false, message: "Email is already in use." };
  }

  const user = await createUser(email);

  const accessToken = createAccessToken({ email, id: user.id });
  const refreshToken = createRefreshToken({ email, id: user.id });
  const hashedPassword = await createHashedPassword(password);

  const account = await createAccount({
    userId: user.id,
    access_token: accessToken,
    refresh_token: refreshToken,
    hashedPassword,
  });

  // const token = await createVerifyEmailToken(user.id);
  // await sendEmail(
  //   email,
  //   `Verify`,
  //   <VerifyEmail token={token} />
  // );

  return { success: true, data: account };
}
