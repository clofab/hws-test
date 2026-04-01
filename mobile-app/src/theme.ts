export const theme = {
  colors: {
    // Background layers
    bg: "#0A0A0F",
    bgCard: "#111118",
    bgInput: "#16161F",
    bgElevated: "#1C1C28",

    // Brand — electric indigo → violet
    primary: "#6C63FF",
    primaryLight: "#8B83FF",
    primaryDark: "#4F48CC",
    accent: "#FF6584",
    accentGlow: "rgba(108, 99, 255, 0.35)",

    // Text
    textPrimary: "#F0EFFB",
    textSecondary: "#8F8FA8",
    textMuted: "#4A4A66",

    // Status
    success: "#4ADE80",
    error: "#F87171",
    warning: "#FBBF24",

    // Borders
    border: "rgba(108, 99, 255, 0.18)",
    borderFocus: "rgba(108, 99, 255, 0.6)",
  },

  typography: {
    // System font stack — elegant on both platforms
    fontDisplay: "System",
    fontBody: "System",
    sizes: {
      xs: 11,
      sm: 13,
      base: 15,
      md: 17,
      lg: 20,
      xl: 24,
      "2xl": 30,
      "3xl": 38,
    },
    weights: {
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
      black: "900" as const,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  shadows: {
    card: {
      shadowColor: "#6C63FF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    glow: {
      shadowColor: "#6C63FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12,
    },
  },
};

export type Theme = typeof theme;
