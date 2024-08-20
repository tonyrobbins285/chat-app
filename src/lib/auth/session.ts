import "server-only";

import { createRefreshToken } from "@/data-access/token";
import { cookies } from "next/headers";
import { generateToken, verifyToken } from "@/lib/auth/token";
import { InternalServerError } from "@/lib/errors/server";
import { SessionType } from "@/lib/types";

export const createSession = async (userId: string) => {
  try {
    const refreshToken = await createRefreshToken({ userId });
    const { token, expires } = await generateToken({ userId }, "ACCESS");

    cookies().set("refreshToken", refreshToken.token, {
      secure: true,
      httpOnly: true,
      expires: refreshToken.expires,
      path: "/",
      sameSite: "lax",
    });
    cookies().set("authorization", `Bearer ${token}`, {
      secure: true,
      expires,
      path: "/",
      sameSite: "lax",
    });

    return token;
  } catch (error) {
    console.error(`Failed to create session: `, error);
    throw new InternalServerError(`Could not create session.`);
  }
};

export const getServerSession = async () => {
  try {
    const cookieStore = cookies();
    const authToken =
      cookieStore.get("authorization")?.value ||
      cookieStore.get("Authorization")?.value;
    if (!authToken || !authToken.startsWith("Bearer ")) {
      return undefined;
    }

    const token = authToken.split(" ")[1];
    const { userId } = await verifyToken<SessionType>(token, "ACCESS");

    return { userId };
  } catch (error) {
    console.error(`Failed to get server session: `, error);
    throw new InternalServerError(`Could not get server session.`);
  }
};
