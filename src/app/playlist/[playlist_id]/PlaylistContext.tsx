"use client";

import { DTOPlaylist } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PlaylistContextType {
  playlist: DTOPlaylist | null;
  setPlaylist: (playlist: DTOPlaylist | null) => void;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

interface PlaylistContextProviderProps {
  children: ReactNode,
  ssrPlaylist: DTOPlaylist
}

export const PlaylistContextProvider = (
  { children, ssrPlaylist }: PlaylistContextProviderProps) => {
  const [playlist, setPlaylist] = useState<DTOPlaylist | null>(ssrPlaylist || null);

  return (
    <PlaylistContext.Provider value={{
      playlist, setPlaylist
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => {
  const ctx = useContext(PlaylistContext);
  if (!ctx) throw new Error("usePlaylistContext must be used within a PlaylistContextProvider");
  return ctx;
};
