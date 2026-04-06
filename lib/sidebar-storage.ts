const KEY = "sidebar-expanded";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeSidebarExpanded(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getSidebarExpandedSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(KEY) !== "false";
}

export function getSidebarExpandedServerSnapshot(): boolean {
  return true;
}

export function setSidebarExpanded(next: boolean) {
  localStorage.setItem(KEY, String(next));
  if (typeof document !== "undefined") {
    if (next) {
      document.documentElement.style.removeProperty("--sb-rail");
    } else {
      document.documentElement.style.setProperty("--sb-rail", "72px");
    }
  }
  emit();
}
