import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { SignInSchema } from "./zod/schema";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  providers: [
    GitHub,
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials, req) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          throw new Error("Invalid Credentials.");
        }

        // const {email, password} = validatedFields.data
        // const user = await prisma.user.findUnique({
        //   where: {
        //     email: credentials.email,
        //   },
        // });

        // if (!user) {
        //   throw new Error("Invalid Credentials");
        // }

        // const validPassword = await
        return null;
      },
    }),
  ],
});
