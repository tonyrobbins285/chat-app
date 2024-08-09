import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "./lib/session";
import { getLoginUrl } from "./lib/utils";
import { CLIENT_URL } from "./lib/constants";
import { AUTH_ROUTES } from "./routes";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const session = await getServerSession();
  if (AUTH_ROUTES.includes(nextUrl.pathname)) {
    const from = nextUrl.searchParams.get("from") || "/";
    if (session) {
      return NextResponse.redirect(new URL(from, CLIENT_URL));
    } else {
      return NextResponse.next();
    }
  }

  if (!session) {
    const loginUrl = getLoginUrl(req);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
