"use server";

import { InvalidTokenError } from "@/lib/errors/client";
import { ResetPasswordFormType } from "@/lib/types";
import { validateInputs } from "@/lib/utils";
import { resetPassword } from "@/lib/utils/email";
import { handleAsyncAction } from "@/lib/utils/handle-async-action";
import { ResetPasswordSchema } from "@/schemas/authSchema";

export const resetPasswordAction = handleAsyncAction(
  async ({ token, password }: ResetPasswordFormType) => {
    if (!token) {
      throw new InvalidTokenError();
    }
    await validateInputs({ password }, ResetPasswordSchema);
    await resetPassword({ token, password });
  },
  "resetPasswordAction",
);
