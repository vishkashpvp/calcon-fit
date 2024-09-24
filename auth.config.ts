import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

const config: NextAuthConfig = {
  providers: [Google, Facebook],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl + "/app";
    },
  },
};

export default config satisfies NextAuthConfig;
