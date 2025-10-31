"use client";

import { DTOPlaylist, DTOPlaylistResource } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiRequestService } from "../../../../factories/apiRequestService";

interface PlaylistEditContextType {
  tabSelectedKey: "info" | "items";
  setTabSelectedKey: (key: "info" | "items") => void;
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
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  playlistResources: DTOPlaylistResource[];
  setPlaylistResources: (resources: DTOPlaylistResource[]) => void;
};

const PlaylistEditContext = createContext<PlaylistEditContextType | undefined>(undefined);

interface PlaylistEditContextProviderProps {
  children: ReactNode
  ssrPlaylist: DTOPlaylist
}

export const PlaylistEditContextProvider = (
  { children, ssrPlaylist }: PlaylistEditContextProviderProps) => {
  const [tabSelectedKey, setTabSelectedKey] = useState<"info" | "items">("info");
  const [medium, setMedium] = useState<string>(`${ssrPlaylist.medium_id}`);
  const [sharableStatus, setSharableStatus] = useState<string>(`${ssrPlaylist.sharable_status_id}`);
  const [title, setTitle] = useState<string>(ssrPlaylist.title || "");
  const [description, setDescription] = useState<string>(ssrPlaylist.description || "");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [playlistResources, setPlaylistResources] = useState<DTOPlaylistResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPlaylistResourcesAll() {
      setIsLoading(true);
      const response = await apiRequestService.reqPlaylistResourceGetAllByPlaylistIdTextPrivate(
        ssrPlaylist.id_text
      );
      
      setPlaylistResources(response);
      setIsLoading(false);
    }
    
    if (tabSelectedKey === "items") {
      fetchPlaylistResourcesAll();
    }
  }, [tabSelectedKey]);

  return (
    <PlaylistEditContext.Provider value={{
      tabSelectedKey, setTabSelectedKey,
      medium, setMedium,
      title, setTitle,
      description, setDescription,
      sharableStatus, setSharableStatus,
      isUpdating, setIsUpdating,
      isLoading, setIsLoading,
      playlistResources, setPlaylistResources
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
