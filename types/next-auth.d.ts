import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      username: string;
      email: string;
    };
  }

  interface DefaultUser {
    id: string;
    username?: string | null;
    email?: string | null;
  }
}
