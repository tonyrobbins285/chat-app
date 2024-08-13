import { z } from "zod";
import {
  VerifyEmailSchema,
  SignUpSchema,
  SignInSchema,
} from "@/schemas/authSchema";

export type SignUpType = z.infer<typeof SignUpSchema>;
export type VerifyEmailType = z.infer<typeof VerifyEmailSchema>;
export type SignInType = z.infer<typeof SignInSchema>;
