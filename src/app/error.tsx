"use client";

export default function ErrorPage({ error }: { error: Error }) {
  console.log(error);
  return (
    <div className="container mx-auto min-h-screen space-y-8 py-12">
      <>
        <h1>Oops! Something went wrong</h1>
        <p className="text-lg">{error.message}</p>
      </>
    </div>
  );
}
