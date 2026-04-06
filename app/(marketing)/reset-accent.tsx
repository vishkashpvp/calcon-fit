"use client";

import { useEffect } from "react";

const ACCENT_VARS = [
  "--accent-violet",
  "--bar-fill",
  "--primary",
  "--primary-foreground",
  "--ring",
] as const;

export function ResetAccent() {
  useEffect(() => {
    const root = document.documentElement;
    const saved = new Map<string, string>();
    ACCENT_VARS.forEach((v) => {
      const val = root.style.getPropertyValue(v);
      if (val) saved.set(v, val);
      root.style.removeProperty(v);
    });
    return () => {
      saved.forEach((val, key) => root.style.setProperty(key, val));
    };
  }, []);

  return null;
}
