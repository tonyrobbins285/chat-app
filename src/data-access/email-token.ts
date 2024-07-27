import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const TOKEN_TTL = 5 * 60 * 1000;

export const createVerifyEmailToken = async (userId: string) => {
  const token = crypto.randomBytes(128).toString("hex");
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await prisma.emailVerificationToken.upsert({
    where: { userId },
    create: {
      userId,
      token,
      tokenExpiresAt,
    },
    update: {
      token,
      tokenExpiresAt,
    },
  });

  return { token };
};
