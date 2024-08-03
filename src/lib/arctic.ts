import { GitHub } from "arctic";

export const github = new GitHub(
  process.env.GITHUB_ID!,
  process.env.GITHUB_SECRET!,
  null,
);
