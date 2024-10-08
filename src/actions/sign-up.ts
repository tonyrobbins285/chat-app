"use server";

import { AuthType } from "@/lib/types";
import { validateInputs } from "@/lib/utils";
import { handleAsyncAction } from "@/lib/utils/handle-async-action";
import { SignUpSchema } from "@/schemas/authSchema";
import { signUp } from "@/use-cases/auth";

export const signUpAction = handleAsyncAction(async (inputs: AuthType) => {
  await validateInputs(inputs, SignUpSchema);
  await signUp(inputs);
}, "signUpAction");
