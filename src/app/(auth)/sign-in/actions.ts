"use server";

import { InputValidationError } from "@/lib/errors";
import { handleAsyncAction } from "@/lib/handle-async-action";
import { signInUseCase } from "@/use-cases/user";
import { SignInSchema } from "@/zod/schema";
import { SignInType } from "@/zod/types";

export const signInAction = handleAsyncAction(async (inputs: SignInType) => {
  const validatedInputes = await SignInSchema.safeParseAsync(inputs);

  if (!validatedInputes.success) {
    throw new InputValidationError();
  }

  const accessToken = await signInUseCase(validatedInputes.data);

  return { accessToken };
}, "signInAction");
