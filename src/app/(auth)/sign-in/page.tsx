import Image from "next/image";
import Link from "next/link";
import { Facebook, Github } from "lucide-react";
import type { Metadata } from "next";
import SignInForm from "@/components/sign-in/sign-in-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login Page",
};

export default function LoginPage() {
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
        <h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in
        </h1>
      </div>

      {/* Credentials */}
      <div>
        <p className="mb-7 text-sm">
          New user?{" "}
          <Link
            href="/sign-up"
            className="text-blue-700 hover:underline hover:underline-offset-2"
          >
            Create an account
          </Link>
        </p>
        <SignInForm />
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
