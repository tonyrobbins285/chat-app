import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { TokenType } from "@/lib/types";
import { env } from "@/lib/env";
import { InternalServerError } from "@/lib/errors/server";
import { TOKEN_TTL } from "@/lib/constants";
import { JWTClaimValidationFailed, JWTExpired, JWTInvalid } from "jose/errors";
import { InvalidTokenError } from "@/lib/errors/client";

export const generateToken = async (
  payload: Record<string, string>,
  type: TokenType,
) => {
  const expires = new Date(Date.now() + TOKEN_TTL[type]);

  try {
    const secret = await getTokenSecret(type);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expires)
      .sign(secret);

    return { token, expires };
  } catch (error) {
    console.error(`Failed to generate ${type.toLowerCase()} token: `, error);
    throw new InternalServerError(
      `Could not generate ${type.toLowerCase()} token.`,
    );
  }
};

export const getTokenSecret = async (type: TokenType) => {
  switch (type) {
    case "ACCESS":
      return new TextEncoder().encode(env.ACCESS_TOKEN_SECRET);
    case "REFRESH":
      return new TextEncoder().encode(env.REFRESH_TOKEN_SECRET);
    case "VERIFICATION":
      return new TextEncoder().encode(env.VERIFICATION_TOKEN_SECRET);
    case "RESET":
      return new TextEncoder().encode(env.RESET_TOKEN_SECRET);
  }
};

export const verifyToken = async <T>(
  token: string,
  type: TokenType,
): Promise<T> => {
  try {
    const secret = await getTokenSecret(type);
    const verifiedToken = await jwtVerify(token, secret);
    return verifiedToken.payload as T;
  } catch (error) {
    if (
      error instanceof (JWTExpired || JWTInvalid || JWTClaimValidationFailed)
    ) {
      throw new InvalidTokenError();
    }
    console.error(`Failed to verify ${type.toLowerCase()} token: `, error);
    throw new InternalServerError(
      `Could not verify ${type.toLowerCase()} token.`,
    );
  }
};
