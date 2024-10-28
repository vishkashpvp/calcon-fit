import { DefaultSession, User as DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      currentWeight: number;
      targetWeight: number;
      height: number;
      gender: "male" | "female" | "other";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    currentWeight: number;
    targetWeight: number;
    height: number;
    gender: "male" | "female" | "other";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    gender?: "male" | "female" | "other";
  }
}
