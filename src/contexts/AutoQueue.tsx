import { DTOChannel, DTOItemQueueItem, MediumEnum } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

type AutoQueueResourcesMap = { [key: number]: DTOItemQueueItem };

type AutoQueueMedium = "aqpodcast" | "aqmusic" | "aqplaylist";

export type AutoQueueConfig = {
  aqmedium?: AutoQueueMedium;
  random?: boolean;
  repeat?: boolean;
  disabled?: boolean;
  playlist_id_text?: string | null;
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
  autoQueueActiveRow: number | null;
  setAutoQueueActiveRow: (val: number | null) => void;
};

export const AutoQueueContext = createContext<AutoQueueContextType>({
  autoQueueResources: {},
  setAutoQueueResources: () => {},
  autoQueueConfig: {},
  setAutoQueueConfig: () => {},
  autoQueueActiveRow: null,
  setAutoQueueActiveRow: () => {}
});

type AutoQueueProviderProps = {
  children: ReactNode;
};

export const AutoQueueProvider = ({
  children
}: AutoQueueProviderProps) => {
  const [autoQueueResources, setAutoQueueResources] = useState<AutoQueueResourcesMap>({});
  const [autoQueueConfig, setAutoQueueConfig] = useState<AutoQueueConfig>({});
  const [autoQueueActiveRow, setAutoQueueActiveRow] = useState<number | null>(null);

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
