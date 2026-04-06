const KEY = "sidebar-position";

export type SidebarPosition = "left" | "right";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeSidebarPosition(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getSidebarPositionSnapshot(): SidebarPosition {
  if (typeof window === "undefined") return "left";
  const stored = localStorage.getItem(KEY);
  return stored === "right" || stored === "top" ? "right" : "left";
}

export function getSidebarPositionServerSnapshot(): SidebarPosition {
  return "left";
}

const SB_INSET = "max(0px, calc(50vw - 700px))";

export function setSidebarPosition(pos: SidebarPosition) {
  localStorage.setItem(KEY, pos);
  if (typeof document !== "undefined") {
    const s = document.documentElement.style;
    const cl = document.documentElement.classList;
    if (pos === "right") {
      s.setProperty("--sb-left", "auto");
      s.setProperty("--sb-right", SB_INSET);
      s.setProperty("--sb-order", "9999");
      cl.add("nav-top");
    } else {
      s.setProperty("--sb-left", SB_INSET);
      s.setProperty("--sb-right", "auto");
      s.setProperty("--sb-order", "-1");
      cl.remove("nav-top");
    }
  }
  emit();
}
