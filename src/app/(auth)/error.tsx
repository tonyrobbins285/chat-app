"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
        Something went wrong!
      </h2>
      <div className="flex flex-col items-center gap-4">
        <Button
          className="w-[200px]"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Link href="/sign-in">
          <Button className="w-[200px]">Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button className="w-[200px]">Sign Up</Button>
        </Link>
      </div>
    </>
  );
}
