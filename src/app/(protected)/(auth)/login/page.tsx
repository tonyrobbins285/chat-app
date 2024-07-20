import Image from "next/image";
import Link from "next/link";
import { Facebook, Github } from "lucide-react";
import { signIn } from "@/auth";
import AuthForm from "@/components/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login Page",
};

export default function LoginPage() {
  console.log("page");
  return (
    <>
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
          Sign in
        </h2>
      </div>

      {/* Credentials */}
      <div>
        <p className="mb-7 text-sm">
          New user?{" "}
          <Link
            href="/register"
            className="text-blue-700 hover:underline hover:underline-offset-2"
          >
            Create an account
          </Link>
        </p>
        <AuthForm variant="Login" />
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
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button type="submit">Signin with GitHub</button>
        </form>

        <div className="cursor-pointer rounded-full border-2 p-3 hover:border-blue-700">
          <Github size={30} />
        </div>
        <div className="cursor-pointer rounded-full border-2 p-3 hover:border-blue-700">
          <Facebook size={30} />
        </div>
      </div>
    </>
  );
}
