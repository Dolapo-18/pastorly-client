/**
 * Pastorly design tokens.
 * Mirror these in tailwind.config.js for NativeWind className usage.
 */
export const splashPalette = {
  primary: "#5847B0",
  background: "#3F2B96",
  backgroundDeep: "#2A1B7A",
  backgroundMid: "#352088",
  ivory: "#FAF9F6",
} as const;

/** Gradient stops for splash & branded dark surfaces */
export const splashGradient = {
  colors: ["#4F3DB5", "#3F2B96", "#2A1B7A"] as const,
  locations: [0, 0.45, 1] as const,
};

/**
 * Accent hues for data visualisation and category icons.
 * Sampled from the design-system swatches in assets/mockups/pastorly-ui-screens.png.
 */
export const accents = {
  purple: "#5847B0",
  coral: "#EF6B4F",
  amber: "#D9A21F",
  green: "#4FA97B",
  pink: "#D9538A",
  teal: "#3FA796",
  crimson: "#D93A4E",
} as const;

export const themePalettes = {
  light: {
    primary: splashPalette.primary,
    primaryDark: splashPalette.background,
    background: splashPalette.ivory,
    surface: "#FFFFFF",
    surfaceStrong: "#F5F3FF",
    surfaceMuted: "#EDE9FE",
    text: "#171717",
    textMuted: "#6B7280",
    textSubtle: "#9CA3AF",
    textFaint: "#D1D5DB",
    border: "#E5E7EB",
    success: "#059669",
    successSoft: "#DDEFE5",
    error: "#EF4444",
    onPrimary: "#FFFFFF",
    onDark: "#FFFFFF",
    lavender: "#EDE9FE",
    scriptureCard: "#E1D5FD",
    shadow: "#000000",
    overlay: "rgba(20,12,60,0.75)",
  },
  dark: {
    primary: "#8B7AE8",
    primaryDark: "#6B5DD3",
    background: "#140A33",
    surface: "#1E1045",
    surfaceStrong: "#271558",
    surfaceMuted: "#2A1A5C",
    text: "#F5F3FF",
    textMuted: "#C4B5FD",
    textSubtle: "#9D8FD9",
    textFaint: "#6E5FA8",
    border: "#3D2B7A",
    success: "#34D399",
    successSoft: "rgba(52,211,153,0.14)",
    error: "#F87171",
    onPrimary: "#FFFFFF",
    onDark: "#FFFFFF",
    lavender: "#352060",
    scriptureCard: "#2E1C63",
    shadow: "#000000",
    overlay: "rgba(10,5,30,0.88)",
  },
} as const;

export type AppThemeColors =
  (typeof themePalettes)[keyof typeof themePalettes];

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Pill-shaped buttons — use explicit borderRadius.button in style on Android */
export const borderRadius = {
  button: 50,
  input: 14,
  card: 16,
} as const;

/** Minimum time the branded splash stays visible after native splash hides */
export const SPLASH_MIN_MS = 3200;
