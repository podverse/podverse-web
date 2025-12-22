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
  lsAutoQueueConfig: LocalSettingsState["aqc"];
  setLSAutoQueueConfig: React.Dispatch<React.SetStateAction<LocalSettingsState["aqc"]>>;
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
  const [uiTheme, setUITheme] = useState<UITheme>(toUITheme(ssrLocalSettings.uit));
  const [viewSelected, setViewSelected] = useState<ViewSelectedOption>(ssrLocalSettings.vs);
  const [serverEnvironmentDisclaimerAccepted, setServerEnvironmentDisclaimerAccepted] =
    useState<boolean>(ssrLocalSettings.seda);
  const [lsAutoQueueConfig, setLSAutoQueueConfig] = useState(ssrLocalSettings.aqc || { rp: false, rd: false });
  
  useEffect(() => {
    handleLocalSettingsUpdate({
      uit: uiTheme,
      vs: viewSelected,
      seda: serverEnvironmentDisclaimerAccepted,
      aqc: lsAutoQueueConfig
    });
  }, [uiTheme, viewSelected, serverEnvironmentDisclaimerAccepted, lsAutoQueueConfig]);

  return (
    <LocalSettingsContext.Provider value={{
      uiTheme, setUITheme,
      viewSelected, setViewSelected, 
      serverEnvironmentDisclaimerAccepted, setServerEnvironmentDisclaimerAccepted,
      lsAutoQueueConfig, setLSAutoQueueConfig
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
