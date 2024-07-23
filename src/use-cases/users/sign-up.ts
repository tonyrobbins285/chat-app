import { getUserByEmail } from "@/data-access/users";
import { AuthFormType } from "@/zod/types";

export async function signUpUserUseCase({email, password}: AuthFormType) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User existed!");
  }

  const user = await createUser(email);
  await createAccount(user.id, password);
  await createProfile(user.id, generateRandomName());

  const token = await createVerifyEmailToken(user.id);
  await sendEmail(
    email,
    `Verify your email for ${applicationName}`,
    <VerifyEmail token={token} />
  );

  return { id: user.id };
}