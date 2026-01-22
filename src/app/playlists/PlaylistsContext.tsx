"use client";

import { DTOPlaylist, getTotalPages, QueryParamsPlaylists } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { useFilterDefaults } from "../../hooks/useFilterDefaults";
import { useListPageCache } from "../../hooks/useListPageCache";
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
  // Use the list page cache hook for back navigation caching
  const {
    filterParams, setFilterParams,
    data: playlists, setData: setPlaylists,
    totalPages, setTotalPages,
    shouldSkipFetch
  } = useListPageCache<QueryParamsPlaylists, DTOPlaylist[]>({
    routeKey: "playlists",
    initialParams: initialQueryParams,
    ssrData: ssrPlaylists ?? [],
    ssrTotalPages,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginMessage, setShowLoginMessage] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useFilterDefaults('playlists', filterParams);

  useSkipInitialEffect(() => {
    // Skip fetch if we just restored from cache - data is already correct
    if (shouldSkipFetch.current) {
      shouldSkipFetch.current = false;
      return;
    }

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
