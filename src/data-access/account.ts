import "server-only";

import { InternalServerError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
