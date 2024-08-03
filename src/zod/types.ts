import { z } from "zod";
import { VerifyEmailSchema, SignUpSchema } from "./schema";

export type SignUpType = z.infer<typeof SignUpSchema>;
export type VerifyEmailType = z.infer<typeof VerifyEmailSchema>;
