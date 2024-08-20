"use server";

import { EmailInUseError } from "@/lib/errors";
import { handleAsyncAction } from "@/lib/utils/handle-async-action";
import { checkEmailInUseWithCredentials } from "@/use-cases/auth";

export const checkEmailAction = handleAsyncAction(async (email: string) => {
  try {
    await checkEmailInUseWithCredentials(email);
  } catch (error) {
    if (error instanceof EmailInUseError) {
      throw new EmailInUseError();
    }
  }
}, "checkEmailAction");
