"use client";

import { DTOPlaylist, getTotalPages, getUndeterminedTotalPages, QueryParamsPlaylists } from "podverse-helpers";
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
      if (filterParams.type === "my_playlists" || filterParams.type === "subscribed") {
        if (!loggedInAccount) {
          setPlaylists([]);
          setShowLoginMessage(true);
          return;
        }
      }

      setIsLoading(true);

      const { currentSort, currentRange, currentType, currentMediumId } = getPlaylistsFilterParams({
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range,
        medium_id: filterParams.medium_id
      });

      let playlists: DTOPlaylist[] = [];
      let totalPages = 0;
      
      if (currentType === "global") {
        const response = await apiRequestService.reqPlaylistGetManyPublic({
          page: filterParams.page,
          sort: currentSort,
          range: currentRange,
          medium_id: currentMediumId
        });
        playlists = response.data;
        totalPages = getUndeterminedTotalPages();
      } else if (currentType === "my_playlists") {
        const response = await apiRequestService.reqPlaylistGetManyPrivate({
          page: filterParams.page,
          sort: currentSort,
          range: currentRange,
          medium_id: currentMediumId
        });
        playlists = response.data;
        totalPages = getTotalPages(response.meta?.count, response.meta?.limit);
      } else if (currentType === "subscribed") {
        const response = await apiRequestService.reqPlaylistGetManyPrivateFollowed({
          page: filterParams.page,
          sort: currentSort,
          range: currentRange,
          medium_id: currentMediumId
        });
        playlists = response.data;
        totalPages = getTotalPages(response.meta?.count, response.meta?.limit);
      }

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
