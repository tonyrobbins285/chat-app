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
  { email }: { email: string },
  tx: TransactionType = prisma,
) => {
  try {
    return await tx.user.create({
      data: {
        email,
      },
    });
  } catch (error) {
    console.error(`Failed to create user:`, error);
    throw new InternalServerError(`Could not create user.`);
  }
};

export const updateUserVerification = async ({ id }: { id: string }) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: { emailVerified: new Date() },
    });
  } catch (error) {
    console.error(`Failed to update user verification:`, error);
    throw new InternalServerError(`Could not update user verification.`);
  }
};
