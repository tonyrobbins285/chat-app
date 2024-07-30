import Image from "next/image";
import Link from "next/link";
import { Facebook, Github } from "lucide-react";
import type { Metadata } from "next";
import SignUpForm from "./components/sign-up-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Register Page",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md space-y-8 bg-white px-10 py-8 shadow-md">
      {/* Title */}
      <div>
        <div>
          <Image
            alt="Logo"
            height={48}
            width={48}
            src="/images/logo.png"
            className="mx-auto"
          />
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create an account
        </h2>
      </div>

      {/* Credentials */}
      <div>
        <div className="mb-4">
          <p className="mb-1 text-sm font-bold">Sign up with email</p>
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-blue-700 hover:underline hover:underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>

      {/* Seperator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="h-[1px] w-full bg-gray-300" />
        </div>
        <div className="relative flex items-center justify-center">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* OAuth */}
      <div className="flex gap-2">
        <div className="cursor-pointer rounded-full border-2 p-3 hover:border-blue-700">
          <Github size={30} />
        </div>
        <div className="cursor-pointer rounded-full border-2 p-3 hover:border-blue-700">
          <Facebook size={30} />
        </div>
      </div>
    </div>
  );
}
