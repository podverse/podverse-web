"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DTOChannel, getTotalPages, QueryParamsHome } from "podverse-helpers";
import { apiRequestService } from "../factories/apiRequestService";
import { useAccount } from "../contexts/Account";
import { useSkipInitialEffect } from "../hooks/useSkipInitialEffect";
import { getHomeFilterParams } from "./HomeDropdownConfig";

interface HomeContextType {
  filterParams: QueryParamsHome;
  setFilterParams: (params: QueryParamsHome) => void;
  channels: DTOChannel[];
  setChannels: (channels: DTOChannel[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

interface HomeContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsHome,
  ssrChannels: DTOChannel[],
  ssrTotalPages: number
}

export const HomeContextProvider = ({
  children,
  initialQueryParams,
  ssrChannels,
  ssrTotalPages
}: HomeContextProviderProps) => {
  const [filterParams, setFilterParams] = useState<QueryParamsHome>(initialQueryParams);
  const [channels, setChannels] = useState<DTOChannel[]>(ssrChannels || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useSkipInitialEffect(() => {
    async function fetchChannels() {
      if (!loggedInAccount) {
        setChannels([]);
      }

      setIsLoading(true);
      
      const { currentSort, currentMedium, currentPage } = getHomeFilterParams({
        page: filterParams.page,
        medium: filterParams.medium,
        sort: filterParams.sort
      });
      
      const response = await apiRequestService.reqChannelGetMany({
        page: currentPage,
        medium: currentMedium,
        type: "subscribed",
        sort: currentSort,
        range: null,
        category: null
      });

      const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);
      setTotalPages(totalPages);
      setChannels(response.data);
      setIsLoading(false);
    }
    
    fetchChannels();
  }, [filterParams, loggedInAccount]);

  return (
    <HomeContext.Provider value={{
      filterParams, setFilterParams,
      channels, setChannels,
      totalPages, setTotalPages,
      isLoading, setIsLoading
    }}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHomeContext must be used within a HomeContextProvider");
  return ctx;
};
