"use server";

import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "@/data-access/tokens";
import { cookies, headers } from "next/headers";
import { REFRESH_TOKEN_TTL } from "./constants";
import { getTokenSecret } from "./utils";
import { TokenType } from "./types";

export const generateToken = (
  userId: string,
  expiresIn: string,
  type: TokenType,
) => {
  const secret = getTokenSecret(type);
  return jwt.sign({ userId }, secret, {
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

export const getServerSession = async () => {
  const headerLists = headers();
  const authToken =
    headerLists.get("authorization") || headerLists.get("Authorization");

  if (!authToken?.startsWith("Bearer ")) {
    return undefined;
  }

  const token = authToken.split(" ")[1];

  const decoded = await verifyToken(token, "ACCESS");

  return decoded;
};
