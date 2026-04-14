export const insensTheme = {
  colors: {
    // Core brand
    oudBrown: "#2B1C17",
    porcelainIvory: "#F5EFE9",
    midnightIndigo: "#1E2236",

    // UI colors
    slateBlue: "#5A6E7F", // Splash bg, buttons

    textPrimary: "#1A1A1A",
    textSecondary: "#6B7280",
    dotActive: "#5A6E7F",
    dotInactive: "#C8CDD2",
    buttonText: "#FFFFFF",
    buttonBg: "#2B1C17", // → all buttons update
    onboardingBg: "#F5EFE9", // → all screen backgrounds update
    error: "#DC2626", // → all error texts/borders update
    white: "#FFFFF0", // → all input backgrounds update

    // Home screen
    homeBg: "#F3F3F5",      // Home screen background
    cardBg: "#FFFFFF",       // Pure white card background
    cardTitle: "#1C1C1E",    // Strong primary text on cards
    muted: "#6D7F8F",        // Muted/secondary text
    brandText: "#4A5A68",    // Product brand name text
    lightGray: "#B3BDC4",    // Placeholder / light icon color
    tabInactive: "#9CA3AF",  // Inactive tab icon/label
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 32,
  },
  typography: {
    displaySize: 30,
    bodySize: 16,
    buttonSize: 16,
    displayWeight: "800" as const,
    bodyLineHeight: 24,
  },
} as const;

export type InsensTheme = typeof insensTheme;
