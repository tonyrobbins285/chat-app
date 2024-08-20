import { z } from "zod";
import { strongPasswordRegex } from "@/lib/regex/password";
import { EmailInUseError } from "@/lib/errors/client";
import { getErrorName } from "@/lib/utils";
import { checkEmailInUseWithCredentialsAction } from "@/actions/check-email-in-use-with-credentials";

export const SignUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required." })
    .email("This is not a valid email.")
    .refine(async (email) => {
      const result = await checkEmailInUseWithCredentialsAction(email);
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

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required." })
    .email("This is not a valid email."),
});

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .regex(strongPasswordRegex.regex, {
      message: strongPasswordRegex.message,
    }),
});
