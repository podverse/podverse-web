"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DTOChannel, getTotalPages, QueryParamsChannels } from "podverse-helpers";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { getPodcastsFilterParams } from "./PodcastsDropdownConfig";

interface PodcastsContextType {
  filterParams: QueryParamsChannels;
  setFilterParams: (params: QueryParamsChannels) => void;
  channels: DTOChannel[];
  setChannels: (channels: DTOChannel[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showSubscribeMessage: boolean;
  setShowSubscribeMessage: (show: boolean) => void;
};

const PodcastsContext = createContext<PodcastsContextType | undefined>(undefined);

interface PodcastsContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsChannels,
  ssrChannels: DTOChannel[],
  ssrTotalPages: number
}

export const PodcastsContextProvider = ({
  children,
  initialQueryParams,
  ssrChannels,
  ssrTotalPages
}: PodcastsContextProviderProps) => {
  const router = useRouter();
  const [filterParams, setFilterParams] = useState<QueryParamsChannels>(initialQueryParams);
  const [channels, setChannels] = useState<DTOChannel[]>(ssrChannels || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
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
      
      const { currentSort, currentRange, currentType } = getPodcastsFilterParams({
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range,
        category: filterParams.category
      });
            
      const response = await apiRequestService.reqChannelGetMany({
        ...filterParams,
        type: currentType,
        sort: currentSort,
        range: currentRange
      });

      if (!filterParams.category) {
        router.replace("/podcasts");
      }

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      setChannels(response.data);
      setShowSubscribeMessage(false);
      setIsLoading(false);
    }
    fetchChannels();
  }, [filterParams, loggedInAccount]);

  return (
    <PodcastsContext.Provider value={{
      filterParams, setFilterParams,
      channels, setChannels,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage
    }}>
      {children}
    </PodcastsContext.Provider>
  );
};

export const usePodcastsContext = () => {
  const ctx = useContext(PodcastsContext);
  if (!ctx) throw new Error("usePodcastsContext must be used within a PodcastsContextProvider");
  return ctx;
};
