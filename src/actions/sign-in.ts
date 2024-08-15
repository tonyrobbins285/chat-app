"use server";

import { AuthType } from "@/lib/types";
import { validateInputs } from "@/lib/utils";
import { handleAsyncAction } from "@/lib/utils/handle-async-action";
import { SignInSchema } from "@/schemas/authSchema";
import { signIn } from "@/use-cases/auth";

export const signInAction = handleAsyncAction(async (inputs: AuthType) => {
  const validatedInputes = await validateInputs(inputs, SignInSchema);

  await signIn(validatedInputes);
}, "sign in action");
