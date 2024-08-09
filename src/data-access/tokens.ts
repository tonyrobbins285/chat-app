import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "@/lib/constants";
import { generateToken } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const createAccessToken = async (userId: string) => {
  const token = await generateToken(userId, String(ACCESS_TOKEN_TTL), "ACCESS");

  const expires = new Date(Date.now() + ACCESS_TOKEN_TTL);

  const accessToken = await prisma.accessToken.create({
    data: {
      token,
      expires,
      userId,
    },
  });

  return accessToken;
};

export const createRefreshToken = async (userId: string) => {
  const token = await generateToken(
    userId,
    String(REFRESH_TOKEN_TTL),
    "REFRESH",
  );

  const expires = new Date(Date.now() + REFRESH_TOKEN_TTL);

  const refreshToken = await prisma.refreshToken.create({
    data: {
      token,
      expires,
      userId,
    },
  });

  return refreshToken;
};
