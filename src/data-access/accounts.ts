import { prisma } from "@/lib/prisma";
import { generateUUID } from "@/lib/utils";
import { TransactionType } from "./utils";

export const createAccount = async (
  data: {
    userId: string;
    hashedPassword: string;
  },
  tx: TransactionType = prisma,
) => {
  const account = await tx.account.create({
    data: { ...data, type: "credentials", providerAccountId: generateUUID() },
  });

  return account;
};
