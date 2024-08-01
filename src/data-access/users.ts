import { prisma } from "@/lib/prisma";
import { TransactionType } from "./utils";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
};

export const getUserByGithubId = async (githubId: string) => {
  return await prisma.user.findUnique({
    where: {
      github_id: Number(githubId),
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
    select: {
      id: true,
      email: true,
    },
  });
};

export const updateUserVerification = async (id: string) => {
  return await prisma.user.update({
    where: { id },
    data: { emailVerified: new Date() },
  });
};
