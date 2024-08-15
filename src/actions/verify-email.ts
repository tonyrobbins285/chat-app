"use server";

import { handleAsyncAction } from "@/lib/utils/handle-async-action";
import { verifyEmail } from "@/use-cases/auth";

export const verifyEmailAction = handleAsyncAction(async (token: string) => {
  await verifyEmail({ token });
}, "verify email action");
