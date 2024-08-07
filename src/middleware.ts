import { NextRequest, NextResponse } from "next/server";
import { getTokenFromHeaders, verifyToken } from "./lib/session";

export async function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;

  const token = getTokenFromHeaders(headers);
  if (nextUrl.pathname.includes("/sign-in")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const decoded = await verifyToken(token, "ACCESS");

  if (decoded) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
