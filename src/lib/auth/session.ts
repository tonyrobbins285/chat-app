import { createAuthToken } from "@/data-access/token";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth/token";
import { InternalServerError } from "@/lib/errors";

export const getClientSession = async () => {
  return "x";
};

export const createSession = async (userId: string) => {
  "user server";
  try {
    const accessToken = await createAuthToken({ userId }, "ACCESS");
    const refreshToken = await createAuthToken({ userId }, "REFRESH");

    cookies().set("refreshToken", refreshToken.token, {
      secure: true,
      httpOnly: true,
      expires: refreshToken.expires,
      path: "/",
      sameSite: "strict",
    });
    cookies().set("authorization", `Bearer ${accessToken.token}`, {
      secure: true,
      expires: accessToken.expires,
      path: "/",
      sameSite: "strict",
    });

    return accessToken;
  } catch (error) {
    console.error(`Failed to create session: `, error);
    throw new InternalServerError(`Could not create session.`);
  }
};

export const getServerSession = async () => {
  "use server";
  try {
    const cookieStore = cookies();
    const authToken =
      cookieStore.get("authorization")?.value ||
      cookieStore.get("Authorization")?.value;
    if (!authToken || !authToken.startsWith("Bearer ")) {
      return undefined;
    }

    const token = authToken.split(" ")[1];
    return await verifyAuthToken(token, "ACCESS");
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
