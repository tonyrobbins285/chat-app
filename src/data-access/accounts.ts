import { prisma } from "@/lib/prisma";

export const createAccount = async (data: {
  userId: string;
  hashedPassword: string;
}) => {
  const account = await prisma.account.create({
    data: { ...data, type: "credentials" },
  });

  return account;
};
