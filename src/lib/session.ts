"use server";

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { createAccessToken, createRefreshToken } from "@/data-access/tokens";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "./constants";
import { getTokenSecret } from "./utils";
import { TokenType } from "./types";

export const generateToken = async (
  userId: string,
  expiresIn: Date,
  type: TokenType,
) => {
  const secret = getTokenSecret(type);
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
};

export const verifyToken = async (token: string, type: TokenType) => {
  const secret = getTokenSecret(type);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    if (error) {
      console.log("VERIFY TOKEN ERROR: " + error);
    }
  }
};

export const createSession = async (userId: string) => {
  const accessToken = await createAccessToken(userId);
  const refreshToken = await createRefreshToken(userId);

  cookies().set("refreshToken", refreshToken.token, {
    secure: true,
    httpOnly: true,
    expires: Date.now() + REFRESH_TOKEN_TTL,
    path: "/",
    sameSite: "strict",
  });
  cookies().set("authorization", `Bearer ${accessToken.token}`, {
    secure: true,
    httpOnly: true,
    expires: Date.now() + ACCESS_TOKEN_TTL,
    path: "/",
    sameSite: "strict",
  });

  return accessToken.token;
};

export const getServerSession = async () => {
  const cookieStore = cookies();
  const authToken =
    cookieStore.get("authorization")?.value ||
    cookieStore.get("Authorization")?.value;
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return undefined;
  }

  const token = authToken.split(" ")[1];
  const decoded = await verifyToken(token, "ACCESS");
  console.log(decoded);
  return decoded;
};
