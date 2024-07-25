"use server";

import {
  authenticatedAction,
  unauthenticatedAction,
} from "@/lib/action-procudures";
import { signUpUserUseCase } from "@/use-cases/users/sign-up";
import { SignUpSchema } from "@/zod/schema";
import { redirect } from "next/navigation";
import { ZSAError } from "zsa";

export const signUpAction = unauthenticatedAction
  .input(SignUpSchema)
  .handler(async ({ input }) => {
    console.log(2);
    signUpUserUseCase(input);
    // return redirect("/");
  });
