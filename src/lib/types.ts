import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/schemas/authSchema";
import { z } from "zod";

export type TokenType = "ACCESS" | "REFRESH" | "VERIFICATION" | "RESET";
export type AuthType = { email: string; password: string };
export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema> & {
  token: string;
};
export type SessionType = { userId: string };
