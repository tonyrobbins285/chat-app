import { auth } from "@/auth";
import React from "react";

export default async function Page() {
  const session = await auth();

  if (!session?.user) return <div>No user</div>;

  return <div>{JSON.stringify(session.user)}</div>;
}
