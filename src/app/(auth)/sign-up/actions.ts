"use server";

import { signUpUserUseCase } from "@/use-cases/users/sign-up";
import { SignUpSchema } from "@/zod/schema";
import { z } from "zod";

type signUpActionProps = z.infer<typeof SignUpSchema>;

export const signUpAction = async (values: signUpActionProps) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return;
  }

  try {
    await signUpUserUseCase(validatedFields.data);
  } catch (error) {}
};
