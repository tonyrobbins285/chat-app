import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createHashedPassword = async (plaintextPassword: string) => {
  return await bcrypt.hash(plaintextPassword, 10);
};

export const generateUUID = () => {
  return uuidv4();
};
