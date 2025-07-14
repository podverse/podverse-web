import React, { createContext, useContext, useState, useEffect } from "react";
import { UITheme, toUITheme, setThemeOnDocument } from "../utils/theme";

type ThemeContextType = {
  theme: UITheme;
  setTheme: (theme: UITheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ initialTheme: UITheme; children: React.ReactNode }> = ({
  initialTheme,
  children,
}) => {
  const [theme, setThemeState] = useState<UITheme>(toUITheme(initialTheme));

  useEffect(() => {
    setThemeOnDocument(theme);
  }, [theme]);

  const setTheme = (newTheme: UITheme) => setThemeState(newTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}