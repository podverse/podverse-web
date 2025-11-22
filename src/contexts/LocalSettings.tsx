import React, { createContext, useContext, useState, useEffect } from "react";
import { UITheme, toUITheme, setUIThemeOnDocument } from "../utils/uiTheme";

type LocalSettingsContextType = {
  uiTheme: UITheme;
  setUITheme: (uiTheme: UITheme) => void;
};

type LocalSettingsProps = {
  ssrUITheme: UITheme;
  children: React.ReactNode
}

const LocalSettingsContext = createContext<LocalSettingsContextType | undefined>(undefined);

export const LocalSettingsProvider: React.FC<LocalSettingsProps> = ({
  ssrUITheme,
  children,
}) => {
  const [uiTheme, setUIThemeState] = useState<UITheme>(toUITheme(ssrUITheme));

  useEffect(() => {
    setUIThemeOnDocument(uiTheme);
  }, [uiTheme]);
  const setUITheme = (newUITheme: UITheme) => setUIThemeState(newUITheme);

  return (
    <LocalSettingsContext.Provider value={{
      uiTheme, setUITheme
    }}>
      {children}
    </LocalSettingsContext.Provider>
  );
};

export function useLocalSettings() {
  const ctx = useContext(LocalSettingsContext);
  if (!ctx) throw new Error("useLocalSettings must be used within a LocalSettingsProvider");
  return ctx;
}