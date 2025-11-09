import React, { createContext, useContext, useState, ReactNode } from "react";

type Location = "embedded" | "full-modal" | "floating" | null;

type MediaPlayerVideoType = {
  videoLocation: Location
  setVideoLocation: (val: Location) => void;
};

export const MediaPlayerVideoContext = createContext<MediaPlayerVideoType | undefined>(undefined);

type MediaPlayerVideoProviderProps = {
  children: ReactNode;
};

export const MediaPlayerVideoProvider = ({ children }: MediaPlayerVideoProviderProps) => {
  const [videoLocation, setVideoLocation] = useState<Location>("floating");

  return (
    <MediaPlayerVideoContext.Provider value={{ videoLocation, setVideoLocation }}>
      {children}
    </MediaPlayerVideoContext.Provider>
  );
};

export function useMediaPlayerVideo() {
  const ctx = useContext(MediaPlayerVideoContext);
  if (!ctx) throw new Error("useMediaPlayerVideo must be used within a MediaPlayerVideoProvider");
  return ctx;
}
