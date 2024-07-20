export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid h-screen place-items-center bg-gradient-to-br from-gray-100 to-gray-300 px-3 py-12">
      <div className="w-full max-w-md space-y-8 bg-white px-10 py-8 shadow-md">
        {children}
      </div>
    </div>
  );
}
