import { z } from "zod";
import { strongPasswordRegex } from "@/regex/password";

export const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required." })
    .email("This is not a valid email.")
    .refine(async (e) => {
      // Where checkIfEmailIsValid makes a request to the backend
      // to see if the email is valid.
      // return await checkIfEmailIsValid(e);
      return true;
    }, "An account with this email address already exists."),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .regex(strongPasswordRegex.regex, {
      message: strongPasswordRegex.message,
    }),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required." })
    .email("This is not a valid email."),
  password: z.string().min(1, { message: "Password is required." }),
});
