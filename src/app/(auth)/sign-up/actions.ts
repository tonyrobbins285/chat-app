"use server";

import { authAction, unauthAction } from "@/lib/safe-action";
import { signUpUserUseCase } from "@/use-cases/users/sign-up";
import { SignUpSchema } from "@/zod/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// export const signUpAction = authAction
//   .schema(SignUpSchema)
//   .action(async ({ parsedInput, ctx }) => {
//     console.log(1);
//     signUpUserUseCase(parsedInput);
//     return { xxx: "Success credentials" };
//   });

export const signUpAction = async (inputs: z.infer<typeof SignUpSchema>) => {
  try {
    const validatedInputes = SignUpSchema.safeParse(inputs);
    if (!validatedInputes.success) {
      return {
        success: false,
        message: "Invalid Credentials.",
      };
    }

    const user = await signUpUserUseCase(validatedInputes.data);

    if (!user.success) {
      return user;
    }
    
    return redirect("/");
  } catch (error) {
    console.log("Error: signUpAction");
    return {
      success: false,
      message: "Internal Error",
    };
  }
};
