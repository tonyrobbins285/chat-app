"use server";
import { createRefreshToken } from "@/data-access/token";
import { cookies } from "next/headers";
import { InternalServerError } from "@/lib/errors";
import { generateToken, verifyToken } from "@/lib/auth/token";

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
    return await verifyToken(token, "ACCESS");
    //  decoded =  {
    //   userId: '',
    //   iat: 1723222346,
    //   exp: 1723222376
    // }
  } catch (error) {
    console.error(`Failed to get server session: `, error);
    throw new InternalServerError(`Could not get server session.`);
  }
};
