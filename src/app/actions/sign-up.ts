"use server";

import { InputValidationError } from "@/lib/errors";
import { handleAsyncAction } from "@/lib/handle-async-action";
import { signUpUserUseCase } from "@/use-cases/user";
import { SignUpSchema } from "@/zod/schema";
import { SignUpType } from "@/zod/types";

export const signUpAction = handleAsyncAction(async (inputs: SignUpType) => {
  const validatedInputes = await SignUpSchema.safeParseAsync(inputs);

  if (!validatedInputes.success) {
    throw new InputValidationError();
  }

  await signUpUserUseCase(validatedInputes.data);

  return {
    message: `Email verification was sent to ${validatedInputes.data.email}`,
  };
});
