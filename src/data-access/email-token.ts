import { prisma } from "@/lib/prisma";
import { generateUUID } from "@/lib/utils";
import { TransactionType } from "./utils";

const TOKEN_TTL = 5 * 60 * 1000;

export const createVerifyEmailToken = async (
  userId: string,
  tx: TransactionType = prisma,
) => {
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  const token = await tx.emailVerificationToken.findFirst({
    where: { userId },
  });

  if (token) {
    await tx.emailVerificationToken.delete({
      where: {
        userId,
      },
    });
  }

  const verificationToken = await tx.emailVerificationToken.create({
    data: {
      userId,
      token: generateUUID(),
      tokenExpiresAt,
    },
  });

  return { verificationToken };
};
