"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DTOChannel, getTotalPages, QueryParamsGetManyMusic } from "podverse-helpers";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { useFilterDefaults } from "../../hooks/useFilterDefaults";
import { useListPageCache } from "../../hooks/useListPageCache";
import { getAlbumsFilterParams } from "./AlbumsDropdownConfig";

interface AlbumsContextType {
  filterParams: QueryParamsGetManyMusic;
  setFilterParams: (params: QueryParamsGetManyMusic) => void;
  channels: DTOChannel[];
  setChannels: (channels: DTOChannel[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showSubscribeMessage: boolean;
  setShowSubscribeMessage: (show: boolean) => void;
  showCategoriesModal: boolean;
  setShowCategoriesModal: (show: boolean) => void;
};

const AlbumsContext = createContext<AlbumsContextType | undefined>(undefined);

interface AlbumsContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsGetManyMusic,
  ssrChannels: DTOChannel[],
  ssrTotalPages: number
}

export const AlbumsContextProvider = ({
  children,
  initialQueryParams,
  ssrChannels,
  ssrTotalPages
}: AlbumsContextProviderProps) => {
  // Use the list page cache hook for back navigation caching
  const {
    filterParams, setFilterParams,
    data: channels, setData: setChannels,
    totalPages, setTotalPages,
    shouldSkipFetch
  } = useListPageCache<QueryParamsGetManyMusic, DTOChannel[]>({
    routeKey: "albums",
    initialParams: initialQueryParams,
    ssrData: ssrChannels ?? [],
    ssrTotalPages,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useFilterDefaults('albums', filterParams);

  useSkipInitialEffect(() => {
    // Skip fetch if we just restored from cache - data is already correct
    if (shouldSkipFetch.current) {
      shouldSkipFetch.current = false;
      return;
    }

    async function fetchChannels() {
      if (filterParams.type === "subscribed") {
        if (!loggedInAccount) {
          setChannels([]);
          setShowSubscribeMessage(true);
          return;
        }
      }

      setIsLoading(true);
      
      const { currentSort, currentRange, currentType } = getAlbumsFilterParams({
        page: filterParams.page,
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      }, !!loggedInAccount);

      const response = await apiRequestService.reqChannelGetMany({
        page: filterParams.page,
        medium: "music",
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: null
      });

      const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, filterParams.page);
      setTotalPages(totalPages);
      setChannels(response.data);
      setShowSubscribeMessage(false);
      setIsLoading(false);
    }
    fetchChannels();
  }, [filterParams, loggedInAccount]);

  return (
    <AlbumsContext.Provider value={{
      filterParams, setFilterParams,
      channels, setChannels,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage,
      showCategoriesModal, setShowCategoriesModal
    }}>
      {children}
    </AlbumsContext.Provider>
  );
};

export const useAlbumsContext = () => {
  const ctx = useContext(AlbumsContext);
  if (!ctx) throw new Error("useAlbumsContext must be used within a AlbumsContextProvider");
  return ctx;
};
