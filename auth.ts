import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getAccountByUser } from "@lib/dbFuncs";
import client from "@lib/mongodb";

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
            const userAccount = await getAccountByUser(existingUser.id);
            if (userAccount) {
              if (userAccount.provider !== account.provider) {
                console.log(`User exists, but provider ${account.provider} is new`);
                return `/auth/error?error=provider&provider=${userAccount.provider}`;
              }
            }
          }
          console.log(`User exists, is logging in with the same provider: ${account.provider}`);
        } catch (err) {
          console.error("Error fetching user by email:", err);
          return `/auth/error?error=unknown`;
        }
      }
      return true;
    },
  },
  pages: {
    error: "/auth/error",
  },
});
