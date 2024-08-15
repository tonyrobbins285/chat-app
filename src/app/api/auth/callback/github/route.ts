import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { github } from "@/lib/oauth-provider/github";
import { createAccount, getAccountByGithubId } from "@/data-access/account";
import { createGithubUser } from "@/use-cases/user";
import { createSession } from "@/lib/auth/session";
import {
  getUserByEmail,
  getUserById,
  updateUserVerification,
} from "@/data-access/user";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
    const refreshToken = tokens.refreshToken();
    const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
    const idToken = tokens.idToken();

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const githubEmailResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const githubUser: GitHubUser = await githubUserResponse.json();
    const githubEmails: GitHubEmail[] = await githubEmailResponse.json();
    const primaryEmail = githubEmails.find(
      (email) => email.primary,
    ) as GitHubEmail;

    const user = await getUserByEmail({ email: primaryEmail.email });

    const existingAccount = await getAccountByGithubId({
      githubId: githubUser.id,
    });

    if (!existingAccount) {
      const account = await createAccount({
        data: {
          provider: "github",
          providerAccountId: githubUser.id,
          type: "oauth",
          user: {
            connectOrCreate: {
              where: {
                email: primaryEmail.email,
              },
              create: {
                email: primaryEmail.email,
                emailVerified: new Date(),
              },
            },
          },
        },
      });

      await createSession(account.userId);

      return new Response(null, {
        status: 302,
        headers: {
          Location: process.env.AFTER_LOGIN_URL!,
        },
      });
    }

    const exisitingUser = await getUserById({ id: existingAccount.userId });
    if (exisitingUser) {
      if (!exisitingUser.emailVerified) {
        await updateUserVerification({ id: exisitingUser.id });
      }
      await createSession(existingAccount.id);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = await createGithubUser(githubUser);
    // await setSession(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: process.env.AFTER_LOGIN_URL!,
      },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

export interface GitHubUser {
  id: string;
  name: string;
  avatar_url: string;
}
export interface GitHubEmail {
  email: string;
  verified: boolean;
  primary: boolean;
}
