import Link from "next/link";
import { Facebook, Github } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid h-screen place-items-center bg-gradient-to-br from-gray-100 to-gray-300 px-3 py-12">
      <div className="w-full max-w-md space-y-8 bg-white px-10 py-8 shadow-md">
        {children}
        {/* Seperator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="h-[1px] w-full bg-gray-300" />
          </div>
          <div className="relative flex items-center justify-center">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth */}

        <div className="flex gap-2">
          <Link
            href="/api/auth/github"
            className="cursor-pointer rounded-full border-2 p-3 hover:border-blue-700"
          >
            <Github size={30} />
          </Link>
          <Link
            href=""
            className="cursor-pointer rounded-full border-2 p-3 hover:border-blue-700"
          >
            <Facebook size={30} />
          </Link>
        </div>
      </div>
    </div>
  );
}
