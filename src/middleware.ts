import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  const { nextUrl } = req;
  if (nextUrl.pathname.includes("/login")) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
