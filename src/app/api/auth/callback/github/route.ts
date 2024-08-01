import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { createGithubUserUseCase } from "@/use-cases/users";
import { getAccountByGithubIdUseCase } from "@/use-cases/accounts";
import { github } from "@/lib/auth";
import { setSession } from "@/lib/session";
import { getUserByGithubId } from "@/data-access/users";
import { getAccountByGithubId } from "@/data-access/accounts";

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
    const githubEmail: GitHubEmail = await githubEmailResponse.json();
    const existingAccount = await getAccountByGithubId(githubUser.id);

    if (existingAccount) {
      await setSession(existingAccount.userId);
      return new Response(null, {
        status: 302,
        headers: {
          Location: process.env.AFTER_LOGIN_URL!,
        },
      });
    }

    if (!githubUser.email) {
      const githubUserEmailResponse = await fetch(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
      );
      const githubUserEmails = await githubUserEmailResponse.json();

      githubUser.email = getPrimaryEmail(githubUserEmails);
    }

    const userId = await createGithubUserUseCase(githubUser);
    await setSession(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: process.env.AFTER_LOGIN_URL!,
      },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      return new Response(null, {
        status: 400,
      });
    }
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
}

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  return primaryEmail!.email;
}

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}
