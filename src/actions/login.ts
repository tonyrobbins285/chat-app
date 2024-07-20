"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/zod/schema";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
    });
  } catch (error) {
    console.log(error);
  }
};
