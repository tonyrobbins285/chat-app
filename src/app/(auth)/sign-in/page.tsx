import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SignInForm from "@/components/sign-in/sign-in-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login Page",
};

export default function LoginPage() {
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
    </>
  );
}
