import { prisma } from "@/lib/prisma";
import { generateUUID } from "@/lib/utils";
import { TransactionType } from "./utils";

const TOKEN_TTL = 5 * 60 * 1000;

export const createVerifyEmailToken = async (
  userId: string,
  tx: TransactionType = prisma,
) => {
  const existingToken = await tx.emailVerificationToken.findUnique({
    where: { userId },
  });

  if (existingToken) {
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
      expires: new Date(Date.now() + TOKEN_TTL),
    },
  });

  return verificationToken;
};

export const getVerifyEmailToken = async (token: string) => {
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: {
      token,
    },
  });

  return verificationToken;
};

export const deleteVerifyEmailToken = async (token: string) => {
  const verificationToken = await prisma.emailVerificationToken.delete({
    where: { token },
  });

  return verificationToken;
};
