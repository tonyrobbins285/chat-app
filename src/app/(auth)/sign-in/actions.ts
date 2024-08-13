"use server";

import { InputValidationError } from "@/lib/errors";
import { handleAsyncAction } from "@/lib/handle-async-action";
import { SignInSchema } from "@/schemas/authSchema";
import { SignInType } from "@/types/authTypes";
import { signIn } from "@/use-cases/auth";

export const signInAction = async (inputs: SignInType) => {
  const validatedInputes = await SignInSchema.safeParseAsync(inputs);

  if (!validatedInputes.success) {
    throw new InputValidationError();
  }

  const accessToken = await signIn(validatedInputes.data);

  return { accessToken };
};
