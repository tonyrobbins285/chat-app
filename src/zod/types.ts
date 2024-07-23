import { z } from "zod";
import { SignUpSchema } from "./schema";

export type AuthFormType = z.infer<typeof SignUpSchema>;
