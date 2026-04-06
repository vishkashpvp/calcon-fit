const KEY = "sidebar-position";

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

export function getSidebarPositionSnapshot(): "left" | "right" {
  if (typeof window === "undefined") return "left";
  return localStorage.getItem(KEY) === "right" ? "right" : "left";
}

export function getSidebarPositionServerSnapshot(): "left" | "right" {
  return "left";
}

export function setSidebarPosition(pos: "left" | "right") {
  localStorage.setItem(KEY, pos);
  if (typeof document !== "undefined") {
    const s = document.documentElement.style;
    if (pos === "right") {
      s.setProperty("--sb-left", "auto");
      s.setProperty("--sb-right", "0");
      s.setProperty("--sb-order", "9999");
    } else {
      s.setProperty("--sb-left", "0");
      s.setProperty("--sb-right", "auto");
      s.setProperty("--sb-order", "-1");
    }
  }
  emit();
}
