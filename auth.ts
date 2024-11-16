import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getAccountByUserId } from "@lib/db/account";
import client from "@lib/db/mongodb";

const mongoDBAdapter = MongoDBAdapter(client);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: mongoDBAdapter,
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account && user.email && mongoDBAdapter.getUserByEmail) {
        try {
          const existingUser = await mongoDBAdapter.getUserByEmail(user.email);
          if (existingUser) {
            const userAccount = await getAccountByUserId(existingUser.id);
            if (userAccount) {
              if (userAccount.provider !== account.provider) {
                console.log(`User exists, but provider ${account.provider} is new`);
                return `/auth/error?error=provider&provider=${userAccount.provider}`;
              }
            }
            user.id = existingUser.id;
            user.dailyCalGoal = existingUser.dailyCalGoal;
            user.currentWeight = existingUser.currentWeight || 0;
            user.targetWeight = existingUser.targetWeight || 0;
            user.height = existingUser.height || 0;
            user.gender = existingUser.gender || "other";
            console.log(`User exists, is logging in with the same provider: ${account.provider}`);
          } else {
            user.id = "";
            user.currentWeight = 0;
            user.targetWeight = 0;
            user.height = 0;
            user.gender = "other";
          }
        } catch (err) {
          console.error("Error fetching user by email:", err);
          return `/auth/error?error=unknown`;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.currentWeight = user.currentWeight;
        token.targetWeight = user.targetWeight;
        token.height = user.height;
        token.gender = user.gender;
        token.id = user.id;
        token.dailyCalGoal = user.dailyCalGoal;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.currentWeight = token.currentWeight ?? 0;
      session.user.targetWeight = token.targetWeight ?? 0;
      session.user.height = token.height ?? 0;
      session.user.gender = token.gender ?? "other";
      session.user.id = token.id ?? "";
      session.user.dailyCalGoal = token.dailyCalGoal ?? 0;
      return session;
    },
  },
  pages: {
    error: "/auth/error",
  },
});
