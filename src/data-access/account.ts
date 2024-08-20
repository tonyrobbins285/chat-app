import "server-only";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ACCOUNT_TYPES } from "@/lib/constants";
import { generateHashPassword } from "@/lib/auth/password";
import { AccountNotFoundError, InternalServerError } from "@/lib/errors/server";

export const createAccount = async (args: Prisma.AccountCreateArgs) => {
  try {
    return await prisma.account.create(args);
  } catch (error) {
    console.error(`Failed to create account:`, error);
    throw new InternalServerError(`Could not create account.`);
  }
};

export const getAccount = async (args: Prisma.AccountFindFirstArgs) => {
  try {
    return await prisma.account.findFirst(args);
  } catch (error) {
    console.error(`Failed to get account:`, error);
    throw new InternalServerError(`Could not get account.`);
  }
};
export const getAccountByUserId = async ({ userId }: { userId: string }) => {
  try {
    return await prisma.account.findFirst({ where: { userId } });
  } catch (error) {
    console.error(`Failed to get account:`, error);
    throw new InternalServerError(`Could not get account.`);
  }
};

export const updateAccount = async (args: Prisma.AccountUpdateArgs) => {
  try {
    return await prisma.account.update(args);
  } catch (error) {
    console.error(`Failed to update account:`, error);
    throw new InternalServerError(`Could not update account.`);
  }
};

export const updateHashPassword = async ({
  userId,
  password,
}: {
  userId: string;
  password: string;
}) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId, type: ACCOUNT_TYPES.CREDENTIALS },
    });

    if (!account) {
      throw new AccountNotFoundError();
    }

    const hashPassword = await generateHashPassword(password);

    return await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        hashPassword,
      },
    });
  } catch (error) {
    console.error(`Failed to update account hash password:`, error);
    throw new InternalServerError(`Could not update account hash password.`);
  }
};
