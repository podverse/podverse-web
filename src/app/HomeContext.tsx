"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DTOChannel, getTotalPages, QueryParamsHome } from "podverse-helpers";
import { apiRequestService } from "../factories/apiRequestService";
import { useAccount } from "../contexts/Account";
import { useSkipInitialEffect } from "../hooks/useSkipInitialEffect";
import { useFilterDefaults } from "../hooks/useFilterDefaults";
import { useListPageCache } from "../hooks/useListPageCache";
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
  // Use the list page cache hook for back navigation caching
  const {
    filterParams, setFilterParams,
    data: channels, setData: setChannels,
    totalPages, setTotalPages,
    shouldSkipFetch
  } = useListPageCache<QueryParamsHome, DTOChannel[]>({
    routeKey: "home",
    initialParams: initialQueryParams,
    ssrData: ssrChannels ?? [],
    ssrTotalPages,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useFilterDefaults('home', filterParams);

  useSkipInitialEffect(() => {
    // Skip fetch if we just restored from cache - data is already correct
    if (shouldSkipFetch.current) {
      shouldSkipFetch.current = false;
      return;
    }

    async function fetchChannels() {
      if (!loggedInAccount) {
        setChannels([]);
        return;
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
