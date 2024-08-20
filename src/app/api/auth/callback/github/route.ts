import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { github } from "@/lib/oauth-provider/github";
import {
  createAccount,
  getAccount,
  getAccountByUserId,
  updateAccount,
} from "@/data-access/account";
import { createSession } from "@/lib/auth/session";
import { deleteUserById, getUserById } from "@/data-access/user";
import { CLIENT_URL } from "@/lib/constants";
import { getNameFromEmail } from "@/lib/utils";

export async function GET(request: Request) {
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

    const existingAccount = await getAccount({
      where: {
        type: "oauth",
        provider: "github",
        providerAccountId: String(githubUser.id),
      },
    });

    if (!existingAccount) {
      const account = await createAccount({
        data: {
          provider: "github",
          providerAccountId: String(githubUser.id),
          type: "oauth",
          user: {
            connectOrCreate: {
              where: {
                email: primaryEmail.email,
              },
              create: {
                email: primaryEmail.email,
                name: githubUser.name,
                image: githubUser.avatar_url,
              },
            },
          },
        },
      });

      await createSession(account.userId);
    } else {
      const user = await getUserById({ id: existingAccount.userId });
      if (!user) {
        throw new Error("Unexpected error at: api/auth/callback/github");
      }
      if (primaryEmail.email !== user.email) {
        const account = await updateAccount({
          where: {
            id: existingAccount.id,
          },
          data: {
            user: {
              connectOrCreate: {
                where: {
                  email: primaryEmail.email,
                },
                create: {
                  email: primaryEmail.email,
                  name: githubUser.name || getNameFromEmail(primaryEmail.email),
                  image: githubUser.avatar_url,
                },
              },
            },
          },
        });
        const otherAccount = await getAccountByUserId({
          userId: user.id,
        });
        if (!otherAccount) {
          await deleteUserById({ id: user.id });
        }

        await createSession(account.userId);
      } else {
        await createSession(user.id);
      }
    }

    return Response.redirect(new URL("/", CLIENT_URL));
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
