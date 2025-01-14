import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-[--offwhite] dark:bg-black">
      <SessionProvider>{children}</SessionProvider>
    </section>
  );
}
