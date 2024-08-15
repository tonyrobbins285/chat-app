import { github } from "@/lib/oauth-provider/github";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const scopes = ["user:email", "repo"];
  const url = github.createAuthorizationURL(state, scopes);

  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
