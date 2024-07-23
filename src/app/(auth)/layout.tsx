export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid h-screen place-items-center bg-gradient-to-br from-gray-100 to-gray-300 px-3 py-12">
      {children}
    </div>
  );
}
