import { createTheme } from "@mui/material/styles";

export const gruvbox = {
  background: "#282828",
  backgroundSoft: "#3c3836",
  paper: "#32302f",
  surface: "#504945",

  cream: "#ebdbb2",
  mutedCream: "#d5c4a1",
  gray: "#a89984",

  red: "#fb4934",
  orange: "#fe8019",
  yellow: "#fabd2f",
  green: "#b8bb26",
  aqua: "#8ec07c",
  blue: "#83a598",
  purple: "#d3869b",
} as const;

export const appFont = '"InconsolataLGCNerdFont-Regular", monospace';

export const typography = {
  fontFamily: appFont,

  h1: {
    fontFamily: appFont,
    fontWeight: 700,
  },

  h2: {
    fontFamily: appFont,
    fontWeight: 700,
  },

  h3: {
    fontFamily: appFont,
    fontWeight: 700,
  },

  h4: {
    fontFamily: appFont,
    fontWeight: 700,
  },

  h5: {
    fontFamily: appFont,
    fontWeight: 700,
  },

  h6: {
    fontFamily: appFont,
    fontWeight: 700,
  },

  body1: {
    fontFamily: appFont,
  },

  body2: {
    fontFamily: appFont,
  },

  button: {
    fontFamily: appFont,
    textTransform: "none" as const,
  },
};

export function createAppTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: isDark ? gruvbox.yellow : "#9d5c24",
      },

      secondary: {
        main: isDark ? gruvbox.aqua : "#458588",
      },

      background: {
        default: isDark ? gruvbox.background : "#fbf1c7",
        paper: isDark ? gruvbox.paper : "#f2e5bc",
      },

      text: {
        primary: isDark ? gruvbox.cream : "#3c3836",
        secondary: isDark ? gruvbox.mutedCream : "#665c54",
      },

      error: {
        main: gruvbox.red,
      },

      warning: {
        main: gruvbox.orange,
      },

      success: {
        main: gruvbox.green,
      },

      info: {
        main: gruvbox.blue,
      },
    },

    typography,

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": {
            "--gruvbox-background": isDark ? gruvbox.background : "#fbf1c7",

            "--gruvbox-background-soft": isDark
              ? gruvbox.backgroundSoft
              : "#f2e5bc",

            "--gruvbox-paper": isDark ? gruvbox.paper : "#f2e5bc",

            "--gruvbox-surface": isDark ? gruvbox.surface : "#d5c4a1",

            "--gruvbox-cream": isDark ? gruvbox.cream : "#3c3836",

            "--gruvbox-muted-cream": isDark ? gruvbox.mutedCream : "#665c54",

            "--gruvbox-gray": gruvbox.gray,
            "--gruvbox-red": gruvbox.red,
            "--gruvbox-orange": gruvbox.orange,
            "--gruvbox-yellow": gruvbox.yellow,
            "--gruvbox-green": gruvbox.green,
            "--gruvbox-aqua": gruvbox.aqua,
            "--gruvbox-blue": gruvbox.blue,
            "--gruvbox-purple": gruvbox.purple,
          },

          body: {
            backgroundColor: isDark ? gruvbox.background : "#fbf1c7",

            color: isDark ? gruvbox.cream : "#3c3836",
          },
        },
      },
    },
  });
}
