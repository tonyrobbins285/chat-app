import { InternalServerError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/lib/utils/transaction";
import { Prisma } from "@prisma/client";

export const createAccount = async (
  {
    data,
  }: {
    data: Prisma.AccountCreateInput;
  },
  tx: TransactionType = prisma,
) => {
  try {
    return await tx.account.create({ data });
  } catch (error) {
    console.error(`Failed to create account:`, error);
    throw new InternalServerError(`Could not create account.`);
  }
};

export const getAccount = async (where: Prisma.AccountWhereInput) => {
  try {
    return await prisma.account.findFirst({ where });
  } catch (error) {
    console.error(`Failed to get account:`, error);
    throw new InternalServerError(`Could not get account.`);
  }
};

export const getAccountByGithubId = async ({
  githubId,
}: {
  githubId: string;
}) => {
  try {
    return await prisma.account.findFirst({
      where: {
        type: "oauth",
        provider: "github",
        providerAccountId: githubId,
      },
    });
  } catch (error) {
    console.error(`Failed to get account:`, error);
    throw new InternalServerError(`Could not get account.`);
  }
};
