import "server-only";

import { auth } from "@/auth";
import { createServerAction, createServerActionProcedure } from "zsa";
import { UnauthenticationError } from "./errors";

export const authenticatedAction = createServerActionProcedure()
  .handler(async () => {
    const session = await auth();
    console.log(3);
    if (!session?.user) {
      throw new UnauthenticationError();
    }

    return session.user;
  })
  .createServerAction();

export const unauthenticatedAction = createServerActionProcedure()
  .handler(async () => {
    return null;
  })
  .createServerAction();
