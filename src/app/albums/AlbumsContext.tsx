"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DTOChannel, getTotalPages, QueryParamsGetManyMusic } from "podverse-helpers";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
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
  const [filterParams, setFilterParams] = useState<QueryParamsGetManyMusic>(initialQueryParams);
  const [channels, setChannels] = useState<DTOChannel[]>(ssrChannels || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useSkipInitialEffect(() => {
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
