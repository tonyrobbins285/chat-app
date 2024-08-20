import "server-only";

import { generateToken } from "@/lib/auth/token";
import { InternalServerError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export const createRefreshToken = async ({ userId }: { userId: string }) => {
  try {
    const { token, expires } = await generateToken({ userId }, "REFRESH");

    const data = {
      token,
      expires,
      userId,
    };

    return await prisma.refreshToken.create({ data });
  } catch (error) {
    console.error(`Failed to create refresh token:`, error);
    throw new InternalServerError(`Could not create refresh token.`);
  }
};

export const expiredRefreshToken = async ({ userId }: { userId: string }) => {
  try {
    const expiredToken = await prisma.refreshToken.findMany({
      where: { userId, expires: { lte: new Date() } },
    });

    if (expiredToken) {
      await prisma.refreshToken.deleteMany({ where: { userId } });
    }
  } catch (error) {
    console.error(`Failed to delete expired refresh token:`, error);
    throw new InternalServerError(`Could not delete expired refresh token.`);
  }
};
