"use client";

import { useParams } from "next/navigation";
import { DTOChannel, DTOClip, DTOItem, DTOLiveItem, getTotalPages, QueryParamsChannel } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useAccount } from "../../../contexts/Account";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
// import { getPodcastQueryParams } from "./PodcastDropdownConfig";

interface PodcastContextType {
  queryParams: QueryParamsChannel;
  setQueryParams: (params: QueryParamsChannel) => void;
  channel: DTOChannel;
  setChannel: (channel: DTOChannel) => void;
  liveItems: DTOLiveItem[];
  setLiveItems: (liveItems: DTOLiveItem[]) => void;
  items: DTOItem[];
  setItems: (items: DTOItem[]) => void;
  clips: DTOClip[];
  setClips: (clips: DTOClip[]) => void;  
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showSubscribeMessage: boolean;
  setShowSubscribeMessage: (show: boolean) => void;
  podcastModalShareIsOpen: boolean;
  setPodcastModalShareIsOpen: (show: boolean) => void;
  podcastModalFundingIsOpen: boolean;
  setPodcastModalFundingIsOpen: (show: boolean) => void;
  podcastModalBoostIsOpen: boolean;
  setPodcastModalBoostIsOpen: (show: boolean) => void;
  isCopied: string;
  setIsCopied: (isCopied: string) => void;
};

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

interface PodcastContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsChannel,
  ssrChannel: DTOChannel,
  ssrLiveItems: DTOLiveItem[],
  ssrItems: DTOItem[],
  ssrClips: DTOClip[],
  ssrTotalPages: number
}

export const PodcastContextProvider = ({
  children,
  initialQueryParams,
  ssrChannel,
  ssrLiveItems,
  ssrItems,
  ssrClips,
  ssrTotalPages
}: PodcastContextProviderProps) => {
  const params = useParams();
  const [queryParams, setQueryParams] = useState<QueryParamsChannel>(initialQueryParams);
  const [channel, setChannel] = useState<DTOChannel>(ssrChannel);
  const [liveItems, setLiveItems] = useState<DTOLiveItem[]>(ssrLiveItems || []);
  const [items, setItems] = useState<DTOItem[]>(ssrItems || []);
  const [clips, setClips] = useState<DTOClip[]>(ssrClips || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const [podcastModalShareIsOpen, setPodcastModalShareIsOpen] = useState<boolean>(false);
  const [podcastModalFundingIsOpen, setPodcastModalFundingIsOpen] = useState<boolean>(false);
  const [podcastModalBoostIsOpen, setPodcastModalBoostIsOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<string>("");
  const { loggedInAccount } = useAccount();
  
  if (!params.channel_id) return;
  const channel_id = params.channel_id as string;

  useSkipInitialEffect(() => {
    async function fetchChannel() {
      const channel = await apiRequestService.reqChannelGetByIdOrIdText(channel_id);
      setChannel(channel);
    }

    async function fetchItems() {
      // const { currentSort, currentRange, currentType } = getPodcastQueryParams({
      //   type: queryParams.type,
      //   sort: queryParams.sort,
      //   range: queryParams.range
      // });

      // const response = await apiRequestService.reqChannelGetByIdOrIdText({
      //   ...queryParams,
      //   type: currentType,
      //   sort: currentSort,
      //   range: currentRange
      // });

      const response = await apiRequestService.reqItemGetManyWithoutLiveItemByChannel(channel_id);

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
    }
    
    async function fetchData() {
      setIsLoading(true);
      await fetchChannel();
      await fetchItems();
      setIsLoading(false);
    }
    
    fetchData();
  }, [queryParams, loggedInAccount]);

  return (
    <PodcastContext.Provider value={{
      queryParams,
      setQueryParams,
      channel, setChannel,
      liveItems, setLiveItems,
      items, setItems,
      clips, setClips,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage,
      podcastModalShareIsOpen, setPodcastModalShareIsOpen,
      podcastModalFundingIsOpen, setPodcastModalFundingIsOpen,
      podcastModalBoostIsOpen, setPodcastModalBoostIsOpen,
      isCopied, setIsCopied
    }}>
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcastContext = () => {
  const ctx = useContext(PodcastContext);
  if (!ctx) throw new Error("usePodcastContext must be used within a PodcastContextProvider");
  return ctx;
};
