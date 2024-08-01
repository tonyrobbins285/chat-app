import { prisma } from "@/lib/prisma";
import { TransactionType } from "./utils";

export const createAccountWithCredentials = async (
  data: {
    userId: string;
    hashedPassword: string;
  },
  tx: TransactionType = prisma,
) => {
  const account = await tx.account.create({
    data: { ...data, type: "credentials" },
  });

  return account;
};

export const getCredentialsAccount = async (userId: string) => {
  const account = await prisma.account.findFirst({
    where: { type: "credentials", userId },
  });

  return account;
};

export const getAccountByGithubId = async (githubId: string) => {
  return await prisma.account.findFirst({
    where: {
      type: "oauth",
      provider: "github",
      providerAccountId: githubId,
    },
  });
};
