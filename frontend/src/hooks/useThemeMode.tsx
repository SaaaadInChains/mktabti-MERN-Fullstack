import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { createAppTheme } from "../themes/theme";

type ThemeMode = "light" | "dark";

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

type ThemeModeProviderProps = {
  children: ReactNode;
};

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem("themeMode");

    return savedMode === "dark" ? "dark" : "light";
  });

  const theme = useMemo(() => {
    return createAppTheme(mode);
  }, [mode]);

  function toggleTheme() {
    setMode((currentMode) => {
      const nextMode = currentMode === "light" ? "dark" : "light";

      localStorage.setItem("themeMode", nextMode);

      return nextMode;
    });
  }

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeModeProvider");
  }

  return context;
}
