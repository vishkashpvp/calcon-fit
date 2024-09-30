export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="h-screen p-5 bg-[--offwhite] dark:bg-black">{children}</section>;
}
