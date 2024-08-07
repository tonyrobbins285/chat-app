"use server";

import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "@/data-access/tokens";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "./constants";

type TokenType = "ACCESS" | "REFRESH";

const getTokenSecret = (type: TokenType) => {
  return type === "ACCESS"
    ? (process.env.ACCESS_TOKEN_SECRET as string)
    : (process.env.REFRESH_TOKEN_SECRET as string);
};

export const generateToken = (
  userId: string,
  expiresIn: string,
  type: TokenType,
) => {
  const secret = getTokenSecret(type);
  return jwt.sign(userId, secret, {
    expiresIn,
  });
};

export const verifyToken = async (token: string, type: TokenType) => {
  const secret = getTokenSecret(type);

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log(error.message);
    }
  }
};

export const getTokenFromHeaders = (headers: Headers) => {
  const authToken =
    headers.get("authorization") || headers.get("Authorization");

  if (!authToken?.startsWith("Bearer ")) {
    return undefined;
  }

  return authToken.split(" ")[1];
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

  return accessToken.token;
};
