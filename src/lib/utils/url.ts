import { NextRequest } from "next/server";
import { CLIENT_URL } from "@/lib/constants";

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
