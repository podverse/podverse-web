"use client";

import { DTOPlaylist } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PlaylistEditContextType {
  medium: string;
  setMedium: (medium: string) => void;
  sharableStatus: string;
  setSharableStatus: (status: string) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
};

const PlaylistEditContext = createContext<PlaylistEditContextType | undefined>(undefined);

interface PlaylistEditContextProviderProps {
  children: ReactNode
  ssrPlaylist: DTOPlaylist
}

export const PlaylistEditContextProvider = (
  { children, ssrPlaylist }: PlaylistEditContextProviderProps) => {
  const [medium, setMedium] = useState<string>(`${ssrPlaylist.medium_id}`);
  const [sharableStatus, setSharableStatus] = useState<string>(`${ssrPlaylist.sharable_status_id}`);
  const [title, setTitle] = useState<string>(ssrPlaylist.title || "");
  const [description, setDescription] = useState<string>(ssrPlaylist.description || "");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  return (
    <PlaylistEditContext.Provider value={{
      medium, setMedium,
      title, setTitle,
      description, setDescription,
      sharableStatus, setSharableStatus,
      isUpdating, setIsUpdating
    }}>
      {children}
    </PlaylistEditContext.Provider>
  );
};

export const usePlaylistEditContext = () => {
  const ctx = useContext(PlaylistEditContext);
  if (!ctx) throw new Error("usePlaylistEditContext must be used within a PlaylistEditContextProvider");
  return ctx;
};
