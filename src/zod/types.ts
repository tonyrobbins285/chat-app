import { z } from "zod";
import { VerifyEmailSchema, SignUpSchema, SignInSchema } from "./schema";

export type SignUpType = z.infer<typeof SignUpSchema>;
export type VerifyEmailType = z.infer<typeof VerifyEmailSchema>;
export type SignInType = z.infer<typeof SignInSchema>;
