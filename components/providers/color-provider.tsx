"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { COLOR_PRESETS, COLOR_STORAGE_KEY, DEFAULT_COLOR_ID } from "@/config/colors";

const BUTTON_VARS = ["--primary", "--primary-foreground", "--ring"] as const;

interface ColorContextValue {
  activeColorId: string;
  setColor: (id: string) => void;
}

const ColorContext = createContext<ColorContextValue>({
  activeColorId: DEFAULT_COLOR_ID,
  setColor: () => {},
});

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [activeColorId, setActiveColorId] = useState(DEFAULT_COLOR_ID);

  useEffect(() => {
    const stored = localStorage.getItem(COLOR_STORAGE_KEY);
    if (stored && COLOR_PRESETS.some((p) => p.id === stored)) {
      setActiveColorId(stored);
    }
  }, []);

  useEffect(() => {
    const preset = COLOR_PRESETS.find((p) => p.id === activeColorId);
    if (!preset) return;

    const root = document.documentElement;
    const value = resolvedTheme === "dark" ? preset.dark : preset.light;
    const isDefault = activeColorId === "default";

    if (isDefault) {
      BUTTON_VARS.forEach((v) => root.style.removeProperty(v));
    } else {
      root.style.setProperty("--primary", value);
      root.style.setProperty("--primary-foreground", "oklch(0.985 0 0)");
      root.style.setProperty("--ring", value);
    }

    root.style.setProperty("--accent-violet", value);
    root.style.setProperty("--bar-fill", value);
  }, [activeColorId, resolvedTheme]);

  const setColor = useCallback((id: string) => {
    setActiveColorId(id);
    localStorage.setItem(COLOR_STORAGE_KEY, id);
  }, []);

  return (
    <ColorContext.Provider value={{ activeColorId, setColor }}>{children}</ColorContext.Provider>
  );
}

export function useAccentColor() {
  return useContext(ColorContext);
}
