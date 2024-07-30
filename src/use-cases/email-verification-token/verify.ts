import {
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "@/data-access/email-verification-token";
import { updateUserVerification } from "@/data-access/users";
import { AuthenticationError } from "@/lib/errors";

type verifyEmailUseCaseProps = {
  token: string;
};

export const verifyEmailUseCase = async ({
  token,
}: verifyEmailUseCaseProps) => {
  const tokenEntry = await getVerifyEmailToken(token);

  if (!tokenEntry) {
    throw new AuthenticationError();
  }

  const userId = tokenEntry.userId;

  await updateUserVerification(userId);
  await deleteVerifyEmailToken(token);
  return userId;
};
