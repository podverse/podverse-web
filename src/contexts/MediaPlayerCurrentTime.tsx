import React, { createContext, useContext, useState, ReactNode } from "react";

type MediaPlayerCurrentTimeContextType = {
  mpCurrentTime: number;
  setMPCurrentTime: (val: number) => void;
};

export const MediaPlayerCurrentTimeContext = createContext<MediaPlayerCurrentTimeContextType | undefined>(undefined);

type MediaPlayerCurrentTimeProviderProps = {
  children: ReactNode;
};

export const MediaPlayerCurrentTimeProvider = ({ children }: MediaPlayerCurrentTimeProviderProps) => {
  const [mpCurrentTime, setMPCurrentTime] = useState<number>(0);

  return (
    <MediaPlayerCurrentTimeContext.Provider value={{ mpCurrentTime, setMPCurrentTime }}>
      {children}
    </MediaPlayerCurrentTimeContext.Provider>
  );
};

export function useMediaPlayerCurrentTime() {
  const ctx = useContext(MediaPlayerCurrentTimeContext);
  if (!ctx) throw new Error("useMediaPlayerCurrentTime must be used within a MediaPlayerCurrentTimeProvider");
  return ctx;
}
