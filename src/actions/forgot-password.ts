"use server";

import { ForgotPasswordFormType } from "@/lib/types";
import { validateInputs } from "@/lib/utils";
import { sendResetPassword } from "@/lib/utils/email";
import { handleAsyncAction } from "@/lib/utils/handle-async-action";
import { ForgotPasswordSchema } from "@/schemas/authSchema";

export const forgotPasswordAction = handleAsyncAction(
  async (inputs: ForgotPasswordFormType) => {
    await validateInputs(inputs, ForgotPasswordSchema);
    await sendResetPassword(inputs);
  },
  "forgotPasswordAction",
);
