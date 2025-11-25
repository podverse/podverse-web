import React, { createContext, useContext, useState, useEffect } from "react";
import { UITheme, toUITheme } from "../utils/localSettings/uiTheme";
import { ViewSelectedOption } from "../components/ViewSelector/ViewSelector";
import { handleLocalSettingsUpdate, LocalSettingsState } from "../utils/localSettings/localSettings";

type LocalSettingsContextType = {
  uiTheme: UITheme;
  setUITheme: (uiTheme: UITheme) => void;
  viewSelected: ViewSelectedOption;
  setViewSelected: (view: ViewSelectedOption) => void;
  serverEnvironmentDisclaimerAccepted: boolean;
  setServerEnvironmentDisclaimerAccepted: (accepted: boolean) => void;
};

type LocalSettingsProps = {
  ssrLocalSettings: LocalSettingsState;
  children: React.ReactNode
}

const LocalSettingsContext = createContext<LocalSettingsContextType | undefined>(undefined);

export const LocalSettingsProvider: React.FC<LocalSettingsProps> = ({
  ssrLocalSettings,
  children,
}) => {
  console.log(ssrLocalSettings);

  const [uiTheme, setUITheme] = useState<UITheme>(toUITheme(ssrLocalSettings.uiTheme));
  const [viewSelected, setViewSelected] = useState<ViewSelectedOption>(ssrLocalSettings.viewSelected);
  const [serverEnvironmentDisclaimerAccepted, setServerEnvironmentDisclaimerAccepted] =
    useState<boolean>(ssrLocalSettings.serverEnvironmentDisclaimerAccepted);
  
  useEffect(() => {
    handleLocalSettingsUpdate({
      uiTheme,
      viewSelected,
      serverEnvironmentDisclaimerAccepted
    });
  }, [uiTheme, viewSelected, serverEnvironmentDisclaimerAccepted]);

  return (
    <LocalSettingsContext.Provider value={{
      uiTheme, setUITheme,
      viewSelected, setViewSelected, 
      serverEnvironmentDisclaimerAccepted, setServerEnvironmentDisclaimerAccepted
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
