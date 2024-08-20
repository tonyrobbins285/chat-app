"use server";

import { EmailInUseError } from "@/lib/errors/client";
import { handleAsyncAction } from "@/lib/utils/handle-async-action";
import { checkEmailInUseWithCredentials } from "@/use-cases/auth";

export const checkEmailInUseWithCredentialsAction = handleAsyncAction(
  async (email: string) => {
    try {
      await checkEmailInUseWithCredentials(email);
    } catch (error) {
      if (error instanceof EmailInUseError) {
        throw new EmailInUseError();
      }
    }
  },
  "checkEmailAction",
);
