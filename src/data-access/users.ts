import { prisma } from "@/lib/prisma";
import { TransactionType } from "./utils";

export const getUserByEmail = async (
  email: string,
  tx: TransactionType = prisma,
) => {
  return await tx.user.findUnique({
    where: {
      email,
    },
  });
};

export const getUserById = async (id: string, tx: TransactionType = prisma) => {
  return await tx.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUser = async (
  email: string,
  tx: TransactionType = prisma,
) => {
  return await tx.user.create({
    data: {
      email,
    },
  });
};

export const updateUserVerification = async (id: string) => {
  return await prisma.user.update({
    where: { id },
    data: { emailVerified: new Date() },
  });
};
