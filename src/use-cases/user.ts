import { createAccount } from "@/data-access/account";
import { prisma } from "@/lib/prisma";

export const createGithubUser = async (githubUser: string) => {
  await createAccount({
    data: {
      provider: "github",
      type: "oauth",
      providerAccountId: githubUser,
      user: {},
    },
  });
  await prisma.account.create({ data: { provider: "github", type: "oauth" } });
};
