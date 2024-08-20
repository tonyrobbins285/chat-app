import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SignUpForm from "../../../components/sign-up/sign-up-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Register Page",
};

export default function RegisterPage() {
  return (
    <>
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
    </>
  );
}
