import { z } from "zod";
import { strongPasswordRegex } from "@/lib/regex/password";
import { checkEmailAction } from "@/actions/check-email";
import { EmailInUseError } from "@/lib/errors";
import { getErrorName } from "@/lib/utils";

export const SignUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required." })
    .email("This is not a valid email.")
    .refine(async (email) => {
      const result = await checkEmailAction(email);
      if (
        !result.success &&
        result.error.name === getErrorName(EmailInUseError)
      ) {
        return false;
      }

      return true;
    }, "This email address already exists."),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .regex(strongPasswordRegex.regex, {
      message: strongPasswordRegex.message,
    }),
});

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required." })
    .email("This is not a valid email."),
  password: z.string().min(1, { message: "Password is required." }),
});
