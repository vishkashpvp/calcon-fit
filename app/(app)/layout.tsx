import { Dock } from "@/components/layout/dock";
import { PageTransition } from "@/components/layout/page-transition";
import { ColorProvider } from "@/components/providers/color-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ColorProvider>
      <div className="relative flex min-h-screen overflow-x-hidden">
        <Dock />
        <main className="min-w-0 flex-1 px-5 pt-6 pb-28 sm:px-6 md:px-8 md:pt-6 md:pb-6">
          <div className="mx-auto max-w-6xl">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </ColorProvider>
  );
}
