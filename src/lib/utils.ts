import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnyZodObject } from "zod";
import { InvalidCredentialsError } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateInputs = async <T>(
  inputs: T,
  schema: AnyZodObject,
): Promise<T> => {
  const validatedInputs = await schema.safeParseAsync(inputs);
  if (!validatedInputs.success) {
    throw new InvalidCredentialsError();
  }

  return validatedInputs.data as T;
};
