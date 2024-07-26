"use server";

import { authAction, unauthAction } from "@/lib/safe-action";
import { signUpUserUseCase } from "@/use-cases/users/sign-up";
import { SignUpSchema } from "@/zod/schema";
import { redirect } from "next/navigation";

export const signUpAction = unauthAction
  .schema(SignUpSchema)
  .action(async ({ parsedInput }) => {
    try {
      signUpUserUseCase(parsedInput);
      console.log(2);
      return {
        success: "Successfully logged in",
      };
    } catch (error) {
      console.log("EORRRRO");
      console.log(error);
      return { failure: "Incorrect credentials" };
    }
  });
