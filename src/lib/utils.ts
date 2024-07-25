import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createHashedPassword = async (plaintextPassword: string) => {
  return await bcrypt.hash(plaintextPassword, 10);
};
