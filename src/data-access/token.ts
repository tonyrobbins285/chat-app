import { generateToken } from "@/lib/auth/token";
import { TOKEN_TTL } from "@/lib/constants";
import { InternalServerError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { TokenType } from "@/lib/types";

export const createAuthToken = async (
  { userId }: { userId: string },
  type: TokenType,
) => {
  try {
    const expires = new Date(Date.now() + TOKEN_TTL[type]);
    const token = await generateToken({ userId }, expires, type);

    const data = {
      token,
      expires,
      userId,
    };

    if (type === "ACCESS") {
      return await prisma.accessToken.create({ data });
    } else if (type === "REFRESH") {
      return await prisma.refreshToken.create({ data });
    } else {
      throw new Error("Invalid token type");
    }
  } catch (error) {
    console.error(`Failed to create ${type.toLowerCase()} token:`, error);
    throw new InternalServerError(
      `Could not create ${type.toLowerCase()} token.`,
    );
  }
};
