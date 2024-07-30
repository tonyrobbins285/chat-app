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

export const getVerifyEmailToken = async (token: string) => {
  const existingToken = await prisma.emailVerificationToken.findUnique({
    where: {
      token,
    },
  });

  return existingToken;
};

export const deleteVerifyEmailToken = async (token: string) => {
  await prisma.emailVerificationToken.delete({ where: { token } });
};
