"use client";

import { useRouter } from "next/navigation";
import { DTOChannel, getTotalPages, QueryParamChannels } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { getChannelQueryParams } from "./PodcastsDropdownConfig";

interface PodcastsContextType {
  queryParams: QueryParamChannels;
  setQueryParams: (params: QueryParamChannels) => void;
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

export const PodcastsContextProvider = ({ children, initialQueryParams, ssrChannels, ssrTotalPages }: {
  children: ReactNode,
  initialQueryParams: QueryParamChannels,
  ssrChannels: DTOChannel[],
  ssrTotalPages: number
}) => {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<QueryParamChannels>(initialQueryParams);
  const [channels, setChannels] = useState<DTOChannel[]>(ssrChannels || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useSkipInitialEffect(() => {
    async function fetchChannels() {
      if (queryParams.type === "subscribed") {
        if (!loggedInAccount) {
          setChannels([]);
          setShowSubscribeMessage(true);
          return;
        }
      }

      setIsLoading(true);

      const { currentSort, currentRange, currentType } = getChannelQueryParams({
        type: queryParams.type,
        sort: queryParams.sort,
        range: queryParams.range,
        category: queryParams.category
      });

      const response = await apiRequestService.reqChannelGetMany({
        ...queryParams,
        type: currentType,
        sort: currentSort,
        range: currentRange
      });

      if (!queryParams.category) {
        router.replace("/podcasts");
      }

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      setChannels(response.data);
      setShowSubscribeMessage(false);
      setIsLoading(false);
    }
    fetchChannels();
  }, [queryParams, loggedInAccount]);

  return (
    <PodcastsContext.Provider value={{
      queryParams,
      setQueryParams,
      channels, setChannels,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage,
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
