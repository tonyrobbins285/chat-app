"use server";

import { InputValidationError } from "@/lib/errors";
import { handleAsyncAction } from "@/lib/handle-async-action";
import { sendVerificationUseCase } from "@/use-cases/email-verification";
import { VerifyEmailSchema } from "@/zod/schema";
import { VerifyEmailType } from "@/zod/types";

export const resendVerificationAction = handleAsyncAction(
  async (inputs: VerifyEmailType) => {
    const validatedInputes = await VerifyEmailSchema.safeParseAsync(inputs);

    if (!validatedInputes.success) {
      throw new InputValidationError();
    }

    const result = await sendVerificationUseCase(validatedInputes.data.email);

    return result;
  },
);
