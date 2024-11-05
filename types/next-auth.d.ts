import { DefaultSession, User as DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      currentWeight: number;
      targetWeight: number;
      height: number;
      gender: "male" | "female" | "other";
      age: number;
      dailyCalGoal: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    currentWeight: number;
    targetWeight: number;
    height: number;
    gender: "male" | "female" | "other";
    age: number;
    dailyCalGoal: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    gender?: "male" | "female" | "other";
    age?: number;
    dailyCalGoal?: number;
  }
}
