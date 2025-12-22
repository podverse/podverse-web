import { DTOChannel, DTOItemQueueItem, getShuffleHash, MediumEnum } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { LocalSettingsState } from "../utils/localSettings/localSettings";
import { useLocalSettings } from "./LocalSettings";

type AutoQueueResourcesMap = { [key: number]: DTOItemQueueItem };

type AutoQueueMedium = "aqpodcast" | "aqmusic" | "aqplaylist";

export type AutoQueueConfig = {
  aqmedium: AutoQueueMedium;
  playlist_id_text: string | null;
  disabled: boolean;
  random: boolean;
  repeat: boolean;
  nextPage: number;
  shuffleHash: string;
};

export const getAutoQueueChannelMedium = (channel?: DTOChannel | null, playlist_id_text?: string | null) => {
  if (playlist_id_text) return "aqplaylist";
  if (channel?.medium_id === MediumEnum.Music) return "aqmusic";
  return "aqpodcast";
};

export function checkIsActiveRowHighestKey(
  autoQueueActiveRow: number | null,
  autoQueueResources: AutoQueueResourcesMap
): boolean {
  if (autoQueueActiveRow === null) return false;
  const keys = Object.keys(autoQueueResources).map(Number);
  if (keys.length === 0) return false;
  const highestKey = Math.max(...keys);
  return autoQueueActiveRow === highestKey;
}

export function autoQueueIncrementActiveRow(
  autoQueueActiveRow: number | null
) {
  if (autoQueueActiveRow === null || autoQueueActiveRow < 1) return 1;
  return autoQueueActiveRow + 1;
}

type AutoQueueContextType = {
  autoQueueResources: AutoQueueResourcesMap;
  setAutoQueueResources: (val: AutoQueueResourcesMap) => void;
  autoQueueConfig: AutoQueueConfig;
  setAutoQueueConfig: (val: AutoQueueConfig) => void;
  autoQueueActiveRow: number;
  setAutoQueueActiveRow: (val: number) => void;
};

const defaultAutoQueueConfig: AutoQueueConfig = {
  aqmedium: "aqpodcast",
  playlist_id_text: null,
  disabled: false,
  random: false,
  repeat: false,
  nextPage: 1,
  shuffleHash: getShuffleHash()
};

export const AutoQueueContext = createContext<AutoQueueContextType>({
  autoQueueResources: {},
  setAutoQueueResources: () => {},
  autoQueueConfig: defaultAutoQueueConfig,
  setAutoQueueConfig: () => {},
  autoQueueActiveRow: 0,
  setAutoQueueActiveRow: () => {}
});

type AutoQueueProviderProps = {
  children: ReactNode;
  ssrLocalSettings: LocalSettingsState;
};

export const AutoQueueProvider = ({
  children,
  ssrLocalSettings
}: AutoQueueProviderProps) => {
  const { setLSAutoQueueConfig } = useLocalSettings();
  const initialAutoQueueConfig: AutoQueueConfig = {
    ...defaultAutoQueueConfig,
    ...(ssrLocalSettings?.aqc?.rd ? { random: true } : {}),
    ...(ssrLocalSettings?.aqc?.rp ? { repeat: true } : {})
  };
  const [autoQueueResources, setAutoQueueResources] = useState<AutoQueueResourcesMap>({});
  const [autoQueueConfig, setAutoQueueConfig] = useState<AutoQueueConfig>(initialAutoQueueConfig);
  const [autoQueueActiveRow, setAutoQueueActiveRow] = useState<number>(0);

  useEffect(() => {
    setLSAutoQueueConfig(prev => ({
      ...prev,
      rd: autoQueueConfig.random || false,
      rp: autoQueueConfig.repeat || false
    }));
  }, [autoQueueConfig.random, autoQueueConfig.repeat, setLSAutoQueueConfig]);

  return (
    <AutoQueueContext.Provider
      value={{
        autoQueueResources, setAutoQueueResources,
        autoQueueConfig, setAutoQueueConfig,
        autoQueueActiveRow, setAutoQueueActiveRow
      }}>
      {children}
    </AutoQueueContext.Provider>
  );
};

export function useAutoQueue() {
  const ctx = useContext(AutoQueueContext);
  if (!ctx) throw new Error("useAutoQueue must be used within a AutoQueueProvider");
  return ctx;
}
