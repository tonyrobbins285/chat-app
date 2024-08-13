"use server";

import { SignJWT, jwtVerify } from "jose";
import { TokenType } from "@/lib/types";
import { env } from "@/lib/env";
import { InternalServerError } from "../errors";

export const getAuthTokenSecret = (type: TokenType) => {
  const secret =
    type === "ACCESS" ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET;
  return new TextEncoder().encode(secret);
};

export const generateAuthToken = async (
  userId: string,
  expiresIn: Date,
  type: TokenType,
) => {
  try {
    const secret = getAuthTokenSecret(type);
    return await new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secret);
  } catch (error) {
    console.error(`Failed to generate ${type.toLowerCase()} token: `, error);
    throw new InternalServerError(
      `Could not generate ${type.toLowerCase()} token.`,
    );
  }
};

export const verifyAuthToken = async (token: string, type: TokenType) => {
  try {
    const secret = getAuthTokenSecret(type);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error(`Failed to verify ${type.toLowerCase()} token: `, error);
    throw new InternalServerError(
      `Could not verify ${type.toLowerCase()} token.`,
    );
  }
};
