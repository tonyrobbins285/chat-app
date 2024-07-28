"use server";

import { InputValidationError } from "@/lib/errors";
import { handleAsyncAction } from "@/lib/handle-async-action";
import { signUpUserUseCase } from "@/use-cases/user/sign-up";
import { SignUpSchema } from "@/zod/schema";
import { redirect } from "next/navigation";
import { z } from "zod";

export const signUpAction = handleAsyncAction(
  async (inputs: z.infer<typeof SignUpSchema>) => {
    const validatedInputes = await SignUpSchema.safeParseAsync(inputs);

    if (!validatedInputes.success) {
      throw new InputValidationError();
    }

    await signUpUserUseCase(validatedInputes.data);

    redirect("/");
  },
);
