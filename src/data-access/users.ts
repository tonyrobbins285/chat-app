import { prisma } from "@/lib/prisma";
import { TransactionType } from "./utils";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return user;
};

export const createUser = async (
  email: string,
  tx: TransactionType = prisma,
) => {
  const user = await tx.user.create({
    data: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });
  return user;
};
