"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  User,
  Settings,
  TrendingUp,
  Moon,
  Sun,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, cn } from "@/lib/utils";
import {
  getSidebarExpandedServerSnapshot,
  getSidebarExpandedSnapshot,
  setSidebarExpanded,
  subscribeSidebarExpanded,
} from "@/lib/sidebar-storage";
import {
  getSidebarPositionServerSnapshot,
  getSidebarPositionSnapshot,
  subscribeSidebarPosition,
} from "@/lib/sidebar-position";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/squads", label: "Squads", icon: Users },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

function matchRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const expanded = useSyncExternalStore(
    subscribeSidebarExpanded,
    getSidebarExpandedSnapshot,
    getSidebarExpandedServerSnapshot,
  );
  const position = useSyncExternalStore(
    subscribeSidebarPosition,
    getSidebarPositionSnapshot,
    getSidebarPositionServerSnapshot,
  );
  const isRight = position === "right";

  const toggle = () => setSidebarExpanded(!expanded);

  return (
    <>
      {/* Spacer so main content is not under fixed sidebar */}
      <div
        className="hidden shrink-0 md:block"
        style={{ width: "var(--sb-rail)", order: "var(--sb-order)" } as React.CSSProperties}
        aria-hidden
      />

      <div
        className="bg-background pointer-events-none fixed inset-y-0 z-40 hidden h-dvh md:block"
        style={{
          width: "var(--sb-rail)",
          left: "var(--sb-left)",
          right: "var(--sb-right)",
        }}
        suppressHydrationWarning
      >
        <div className="pointer-events-auto flex h-dvh flex-col p-2">
          <aside
            className="border-border/40 bg-card flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border shadow-sm"
            suppressHydrationWarning
          >
            {/* Brand + collapse */}
            <div className="border-border/40 shrink-0 border-b px-2 py-2">
              <div
                className={cn("flex items-center", expanded ? "justify-between" : "justify-center")}
              >
                <p
                  className={cn(
                    "text-foreground font-black tracking-[0.35em] uppercase transition-opacity duration-200",
                    expanded ? "opacity-100" : "h-0 w-0 overflow-hidden opacity-0",
                  )}
                >
                  CalConFit
                </p>
                <button
                  type="button"
                  onClick={toggle}
                  className="text-muted-foreground hover:text-foreground hover:border-border flex h-9 w-9 items-center justify-center border border-transparent transition-colors"
                  aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                  {(isRight ? !expanded : expanded) ? (
                    <ChevronsLeft className="h-4 w-4" />
                  ) : (
                    <ChevronsRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Nav — scrolls if many items */}
            <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto overscroll-contain p-2">
              {navItems.map((item) => {
                const active = matchRoute(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex h-10 shrink-0 items-center gap-3 px-2.5 text-sm font-medium transition-colors",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && <span className="bg-accent-violet absolute inset-0" />}
                    {active && (
                      <span
                        className={cn(
                          "bg-accent-violet absolute top-1 bottom-1 w-0.5",
                          isRight ? "left-0" : "right-0",
                        )}
                      />
                    )}
                    <item.icon className="relative z-10 h-[18px] w-[18px] shrink-0 transition-colors" />
                    <span
                      className={cn(
                        "relative z-10 overflow-hidden whitespace-nowrap transition-all duration-200",
                        expanded ? "w-auto opacity-100" : "w-0 opacity-0",
                      )}
                    >
                      {item.label}
                    </span>

                    {!expanded && (
                      <span
                        className={cn(
                          "border-border bg-popover pointer-events-none absolute z-50 border px-2.5 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100",
                          isRight ? "right-full mr-3" : "left-full ml-3",
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="min-h-2 flex-1" />

              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted-foreground hover:text-foreground flex h-10 shrink-0 items-center gap-3 px-2.5 text-sm transition-colors"
                aria-label="Toggle theme"
              >
                <span className="relative flex h-[18px] w-[18px] shrink-0">
                  <Sun className="absolute inset-0 m-auto h-[18px] w-[18px] shrink-0 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute inset-0 m-auto h-[18px] w-[18px] shrink-0 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
                </span>
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap transition-all duration-200",
                    expanded ? "w-auto opacity-100" : "w-0 opacity-0",
                  )}
                >
                  Theme
                </span>
              </button>

              {session?.user && (
                <button
                  type="button"
                  onClick={async () => {
                    await signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
                  }}
                  className="text-muted-foreground hover:text-foreground flex h-10 shrink-0 items-center gap-3 px-2.5 text-sm transition-colors"
                >
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={session.user.image ?? ""} alt={session.user.name} />
                    <AvatarFallback className="text-[8px]">
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-200",
                      expanded ? "w-auto opacity-100" : "w-0 opacity-0",
                    )}
                  >
                    <span className="truncate text-xs">{session.user.name.split(" ")[0]}</span>
                    <LogOut className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                  </span>
                </button>
              )}
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}

function MobileBar() {
  const pathname = usePathname();

  return (
    <nav className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      {navItems.map((item) => {
        const active = matchRoute(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center gap-0.5 px-2 py-2.5 text-[10px] transition-colors",
              active ? "text-accent-violet" : "text-muted-foreground",
            )}
          >
            {active && (
              <motion.div
                layoutId="mobile-active"
                className="bg-accent-violet absolute -top-px left-1/2 h-0.5 w-6 -translate-x-1/2"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Dock() {
  return (
    <>
      <Sidebar />
      <MobileBar />
    </>
  );
}
