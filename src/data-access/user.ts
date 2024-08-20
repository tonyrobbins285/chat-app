import "server-only";

import { InternalServerError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/lib/utils/transaction";

export const getUserById = async (
  { id }: { id: string },
  tx: TransactionType = prisma,
) => {
  try {
    return await tx.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(`Failed to get user by id:`, error);
    throw new InternalServerError(`Could not get user.`);
  }
};

export const getUserByEmail = async (
  { email }: { email: string },
  tx: TransactionType = prisma,
) => {
  try {
    return await tx.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    console.error(`Failed to get user by email:`, error);
    throw new InternalServerError(`Could not get user.`);
  }
};

export const createUser = async (
  { email, name, image }: { email: string; name?: string; image?: string },
  tx: TransactionType = prisma,
) => {
  try {
    return await tx.user.create({
      data: {
        email,
        name,
        image,
      },
    });
  } catch (error) {
    console.error(`Failed to create user:`, error);
    throw new InternalServerError(`Could not create user.`);
  }
};

export const deleteUserById = async ({ id }: { id: string }) => {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to delete user:`, error);
    throw new InternalServerError(`Could not delete user.`);
  }
};
