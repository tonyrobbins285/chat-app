import { generateAuthToken } from "@/lib/auth/token";
import { TOKEN_TTL } from "@/lib/constants";
import { InternalServerError, UserNotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { TokenType } from "@/lib/types";
import { generateUUID } from "@/lib/utils/generate";
import { TransactionType } from "@/lib/utils/transaction";
import { getUserByEmail } from "./user";

// Acess / Refresh Tokens
export const createAuthToken = async (
  { userId }: { userId: string },
  type: TokenType,
) => {
  try {
    const expires = new Date(Date.now() + TOKEN_TTL[type]);
    const token = await generateAuthToken(userId, expires, type);

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

// VerifyEmailToken
export const createVerifyEmailToken = async (
  { email }: { email: string },
  tx: TransactionType = prisma,
) => {
  try {
    const user = await getUserByEmail({ email }, tx);

    if (!user) {
      throw new UserNotFoundError();
    }

    const token = await tx.emailVerificationToken.findUnique({
      where: { userId: user.id },
    });

    if (token) {
      await tx.emailVerificationToken.delete({
        where: { userId: user.id },
      });
    }

    return await tx.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: generateUUID(),
        expires: new Date(Date.now() + TOKEN_TTL["VERIFICATION"]),
      },
    });
  } catch (error) {
    console.error(`Failed to create verify email token:`, error);
    throw new InternalServerError(`Could not create verify email token.`);
  }
};

export const getVerifyEmailToken = async ({ token }: { token: string }) => {
  try {
    return await prisma.emailVerificationToken.findUnique({
      where: {
        token,
      },
    });
  } catch (error) {
    console.error(`Failed to get verify email token:`, error);
    throw new InternalServerError(`Could not get verify email token.`);
  }
};

export const deleteVerifyEmailToken = async ({ token }: { token: string }) => {
  try {
    return await prisma.emailVerificationToken.delete({
      where: { token },
    });
  } catch (error) {
    console.error(`Failed to delete verify email token:`, error);
    throw new InternalServerError(`Could not delete verify email token.`);
  }
};
