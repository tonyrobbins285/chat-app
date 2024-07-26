import "server-only";

import { auth } from "@/auth";
import { UnauthenticationError } from "./errors";
import { ZodObject, ZodTypeAny } from "zod";
import { createSafeActionClient } from "next-safe-action";

export const unauthAction = createSafeActionClient();

export const authAction = unauthAction.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Session not found!");
  }

  return next({ ctx: { user: session.user } });
});
