"use client";

import { DTOPlaylist, DTOPlaylistResource, getTotalPages, QueryParamsPlaylistResources } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiRequestService } from "../../../factories/apiRequestService";

interface PlaylistContextType {
  filterParams: QueryParamsPlaylistResources;
  setFilterParams: (params: QueryParamsPlaylistResources) => void;
  playlistResources: DTOPlaylistResource[];
  setPlaylistResources: (playlistResources: DTOPlaylistResource[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

interface PlaylistContextProviderProps {
  children: ReactNode,
  ssrPlaylist: DTOPlaylist
}

export const PlaylistContextProvider = (
  { children, ssrPlaylist }: PlaylistContextProviderProps) => {
  const [filterParams, setFilterParams] = useState<QueryParamsPlaylistResources>({});
  const [playlistResources, setPlaylistResources] = useState<DTOPlaylistResource[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    async function fetchPlaylistResources() {
      const response = await apiRequestService.reqPlaylistResourceGetManyByPlaylistIdText(
        ssrPlaylist.id_text,
        {
          page: filterParams.page
        }
      );
      
      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      setPlaylistResources(response.data);
    }

    fetchPlaylistResources();
  }, [filterParams]);

  return (
    <PlaylistContext.Provider value={{
      filterParams, setFilterParams,
      playlistResources, setPlaylistResources,
      totalPages, setTotalPages
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
