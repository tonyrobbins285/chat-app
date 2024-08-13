import { GitHub } from "arctic";
import { env } from "@/lib/env";

export const github = new GitHub(env.GITHUB_ID, env.GITHUB_SECRET, null);
