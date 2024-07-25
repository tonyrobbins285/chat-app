import { prisma } from "@/lib/prisma";

export const createAccount = async (data: {
  userId: string;
  access_token: string;
  refresh_token: string;
  hashedPassword: string;
}) => {
  await prisma.account.create({
    data: { ...data, type: "credentials" },
  });
};
