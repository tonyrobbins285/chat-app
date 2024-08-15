"use server";

import { SignJWT, jwtVerify } from "jose";
import { TokenType } from "@/lib/types";
import { env } from "@/lib/env";
import { InternalServerError } from "../errors";

export const generateToken = async (
  payload: Record<string, string>,
  expiresIn: Date,
  type: TokenType,
) => {
  try {
    const secret = getTokenSecret(type);
    return await new SignJWT(payload)
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

export const getTokenSecret = (type: TokenType) => {
  let secret = "";
  switch (type) {
    case "ACCESS":
      secret = env.ACCESS_TOKEN_SECRET;
      break;
    case "REFRESH":
      secret = env.REFRESH_TOKEN_SECRET;
      break;
    case "VERIFICATION":
      secret = env.VERIFICATION_TOKEN_SECRET;
      break;
  }

  return new TextEncoder().encode(secret);
};

export const verifyToken = async (token: string, type: TokenType) => {
  try {
    const secret = getTokenSecret(type);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error(`Failed to verify ${type.toLowerCase()} token: `, error);
    throw new InternalServerError(
      `Could not verify ${type.toLowerCase()} token.`,
    );
  }
};
