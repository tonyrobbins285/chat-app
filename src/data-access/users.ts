import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return user;
};

export const createUser = async (email: string) => {
  const user = await prisma.user.create({
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
