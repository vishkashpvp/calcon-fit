import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen p-5 bg-[--offwhite] dark:bg-black">
      <SessionProvider>{children}</SessionProvider>
    </section>
  );
}
