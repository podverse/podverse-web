"use client";

import { DTOPlaylist, getTotalPages, QueryParamsPlaylists } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { getPlaylistsFilterParams } from "./PlaylistsDropdownConfig";

interface PlaylistsContextType {
  filterParams: QueryParamsPlaylists;
  setFilterParams: (params: QueryParamsPlaylists) => void;
  playlists: DTOPlaylist[];
  setPlaylists: (playlists: DTOPlaylist[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showLoginMessage: boolean;
  setShowLoginMessage: (show: boolean) => void;
};

const PlaylistsContext = createContext<PlaylistsContextType | undefined>(undefined);

interface PlaylistsContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsPlaylists,
  ssrPlaylists: DTOPlaylist[],
  ssrTotalPages: number
}

export const PlaylistsContextProvider = ({
  children,
  initialQueryParams,
  ssrPlaylists,
  ssrTotalPages
}: PlaylistsContextProviderProps) => {
  const [filterParams, setFilterParams] = useState<QueryParamsPlaylists>(initialQueryParams);
  const [playlists, setPlaylists] = useState<DTOPlaylist[]>(ssrPlaylists || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginMessage, setShowLoginMessage] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useSkipInitialEffect(() => {
    async function fetchPlaylists() {
      if (filterParams.type === "private" || filterParams.type === "private_followed") {
        if (!loggedInAccount) {
          setPlaylists([]);
          setShowLoginMessage(true);
          return;
        }
      }

      setIsLoading(true);

      const { currentSort, currentRange, currentType, currentMedium } = getPlaylistsFilterParams({
        page: filterParams.page,
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range,
        medium: filterParams.medium
      }, !!loggedInAccount);
      
      const response = await apiRequestService.reqPlaylistGetMany({
        page: filterParams.page,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        medium: currentMedium
      });

      const playlists = response.data;
      const totalPages = getTotalPages(response.meta.count, response.meta.limit, playlists.length, filterParams.page);

      setTotalPages(totalPages);
      setPlaylists(playlists);
      setShowLoginMessage(false);
      setIsLoading(false);
    }
    fetchPlaylists();
  }, [filterParams, loggedInAccount]);

  return (
    <PlaylistsContext.Provider value={{
      filterParams,
      setFilterParams,
      playlists, setPlaylists,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showLoginMessage, setShowLoginMessage,
    }}>
      {children}
    </PlaylistsContext.Provider>
  );
};

export const usePlaylistsContext = () => {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) throw new Error("usePlaylistsContext must be used within a PlaylistsContextProvider");
  return ctx;
};
