import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type MediaPlayerContextType = {
  nowPlayingItem: any;
  setNowPlayingItem: (val: any) => void;
};

export const MediaPlayerContext = createContext<MediaPlayerContextType>({
  nowPlayingItem: null,
  setNowPlayingItem: () => {},
});

type MediaPlayerProviderProps = {
  children: ReactNode;
};

export const MediaPlayerProvider = ({
  children
}: MediaPlayerProviderProps) => {
  const [nowPlayingItem, setNowPlayingItem] = useState<any>(true);

  useEffect(() => {
    updateLayoutForMediaPlayer(nowPlayingItem);
  }, [nowPlayingItem]);

  return (
    <MediaPlayerContext.Provider value={{ nowPlayingItem, setNowPlayingItem }}>
      {children}
    </MediaPlayerContext.Provider>
  );
};

export function useMediaPlayer() {
  const ctx = useContext(MediaPlayerContext);
  if (!ctx) throw new Error("useMediaPlayer must be used within a MediaPlayerProvider");
  return ctx;
}

function updateLayoutForMediaPlayer(nowPlayingItem: any) {
  const sidebar = document.getElementById("sidebar");
  const pageWrapper = document.getElementById("page-wrapper");
  const styleValue = "calc(100vh - var(--media-player-height))";

  if (nowPlayingItem) {
    if (sidebar) {
      sidebar.style.minHeight = styleValue;
      sidebar.style.height = styleValue;
    }
    if (pageWrapper) {
      pageWrapper.style.minHeight = styleValue;
      pageWrapper.style.height = styleValue;
    }
  } else {
    if (sidebar) {
      sidebar.style.minHeight = "";
      sidebar.style.height = "";
    }
    if (pageWrapper) {
      pageWrapper.style.minHeight = "";
      pageWrapper.style.height = "";
    }
  }
}