import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md space-y-8 bg-white px-10 py-8 shadow-md">
      {children}
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
