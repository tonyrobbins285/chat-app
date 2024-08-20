import { Button } from "@/components/ui/button";
import { InvalidTokenError } from "@/lib/errors/client";
import { verifyEmail } from "@/use-cases/auth";
import Link from "next/link";

type VerifyEmailPageProps = {
  searchParams: { token: string };
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = searchParams;
  if (!token) {
    throw new InvalidTokenError();
  }

  await verifyEmail({ token });

  return (
    <div className="w-full max-w-md space-y-8 bg-white px-10 py-8 shadow-md">
      <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
        Your account has been verified successfully!!
      </h2>
      <div className="flex flex-col gap-2">
        <Link href="/sign-in">
          <Button className="w-full bg-gradient-to-tr from-blue-400 to-blue-700 transition-colors duration-500 hover:from-blue-400 hover:to-transparent">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="w-full bg-gradient-to-tr from-blue-400 to-blue-700 transition-colors duration-500 hover:from-blue-400 hover:to-transparent">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
