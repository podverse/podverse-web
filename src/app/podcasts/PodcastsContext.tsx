"use client";

import { CategoryMappingKeys, DTOChannel, QueryParamChannels, QueryParamsChannelsSort,
  QueryParamsChannelsType, QueryParamsStatsRange } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";

interface PodcastsContextType extends QueryParamChannels {
  setPage: (page: number) => void;
  setType: (type: QueryParamsChannelsType) => void;
  setSort: (sort: QueryParamsChannelsSort) => void;
  setRange: (range: QueryParamsStatsRange) => void;
  setCategory: (category: CategoryMappingKeys | undefined) => void;
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
  const [page, setPage] = useState(initialQueryParams.page);
  const [type, setType] = useState(initialQueryParams.type);
  const [sort, setSort] = useState(initialQueryParams.sort);
  const [range, setRange] = useState(initialQueryParams.range);
  const [category, setCategory] = useState<string | undefined>(initialQueryParams.category);
  const [channels, setChannels] = useState<DTOChannel[]>(ssrChannels || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useSkipInitialEffect(() => {
    async function fetchChannels() {
      if (type === "subscribed") {
        if (!loggedInAccount) {
          setChannels([]);
          setShowSubscribeMessage(true);
          return;
        }
      }

      setIsLoading(true);
      const channels = await apiRequestService.reqChannelGetMany({ page, type, sort, range, category });
      setChannels(channels.data);
      setIsLoading(false);
    }
    fetchChannels();
  }, [page, type, sort, range, category])

  return (
    <PodcastsContext.Provider value={{
      page, setPage,
      type, setType,
      sort, setSort,
      range, setRange,
      category, setCategory,
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
