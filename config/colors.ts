export interface ColorPreset {
  id: string;
  name: string;
  /** Preview swatch (used in settings UI) */
  swatch: string;
  /** oklch primary value for light mode */
  light: string;
  /** oklch primary value for dark mode */
  dark: string;
  /** Available to everyone when true */
  free: boolean;
  /** Minimum level required to unlock (ignored when free) */
  unlockLevel?: number;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "default",
    name: "Mono",
    swatch: "oklch(0.5 0 0)",
    light: "oklch(0 0 0)",
    dark: "oklch(1 0 0)",
    free: true,
  },
  {
    id: "blue",
    name: "Blue",
    swatch: "oklch(0.55 0.2 255)",
    light: "oklch(0.49 0.2 255)",
    dark: "oklch(0.62 0.18 255)",
    free: true,
  },
  {
    id: "violet",
    name: "Violet",
    swatch: "oklch(0.55 0.22 290)",
    light: "oklch(0.49 0.22 290)",
    dark: "oklch(0.62 0.2 290)",
    free: false,
    unlockLevel: 2,
  },
  {
    id: "teal",
    name: "Teal",
    swatch: "oklch(0.55 0.12 185)",
    light: "oklch(0.47 0.12 185)",
    dark: "oklch(0.65 0.11 185)",
    free: false,
    unlockLevel: 2,
  },
  {
    id: "green",
    name: "Green",
    swatch: "oklch(0.55 0.17 150)",
    light: "oklch(0.48 0.17 150)",
    dark: "oklch(0.62 0.15 150)",
    free: false,
    unlockLevel: 3,
  },
  {
    id: "rose",
    name: "Rose",
    swatch: "oklch(0.58 0.2 350)",
    light: "oklch(0.52 0.2 350)",
    dark: "oklch(0.65 0.18 350)",
    free: false,
    unlockLevel: 3,
  },
  {
    id: "amber",
    name: "Amber",
    swatch: "oklch(0.7 0.16 70)",
    light: "oklch(0.6 0.16 70)",
    dark: "oklch(0.72 0.14 70)",
    free: false,
    unlockLevel: 4,
  },
  {
    id: "orange",
    name: "Orange",
    swatch: "oklch(0.62 0.19 40)",
    light: "oklch(0.55 0.19 40)",
    dark: "oklch(0.68 0.17 40)",
    free: false,
    unlockLevel: 5,
  },
  {
    id: "crimson",
    name: "Crimson",
    swatch: "oklch(0.55 0.24 15)",
    light: "oklch(0.5 0.24 15)",
    dark: "oklch(0.63 0.22 15)",
    free: false,
    unlockLevel: 6,
  },
];

export const DEFAULT_COLOR_ID = "default";
export const COLOR_STORAGE_KEY = "calconfit-accent";
