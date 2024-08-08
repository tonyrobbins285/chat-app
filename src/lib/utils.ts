import { NextRequest } from "next/server";
import { CLIENT_URL } from "@/lib/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { TokenType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createHashedPassword = async (
  plaintextPassword: string,
  salt: string = "",
) => {
  return await bcrypt.hash(plaintextPassword, salt);
};

export const generateUUID = () => {
  return uuidv4();
};

export const getTokenSecret = (type: TokenType) => {
  return type === "ACCESS"
    ? (process.env.ACCESS_TOKEN_SECRET as string)
    : (process.env.REFRESH_TOKEN_SECRET as string);
};

export const getLoginUrl = (request: NextRequest) => {
  const loginUrl = new URL("/sign-in", CLIENT_URL);
  const pathname =
    request.nextUrl.pathname &&
    request.nextUrl.pathname !== "/" &&
    request.nextUrl.pathname;
  const search = request.nextUrl.search;
  if (pathname || search) {
    loginUrl.searchParams.set("from", pathname ? pathname + search : search);
  }

  return loginUrl;
};

export const getClientSession = async () => {
  return "x";
};
