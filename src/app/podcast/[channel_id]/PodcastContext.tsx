"use client";

import { useParams } from "next/navigation";
import { DTOChannel, DTOClip, DTOItem, DTOLiveItem, getTotalPages, QueryParamsChannel } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useAccount } from "../../../contexts/Account";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { getPodcastFilterParams } from "./PodcastDropdownConfig";

interface PodcastContextType {
  filterParams: QueryParamsChannel;
  setFilterParams: (params: QueryParamsChannel) => void;
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
  const [filterParams, setFilterParams] = useState<QueryParamsChannel>(initialQueryParams);
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
    if (filterParams.type === "about" || filterParams.type === "podroll") {
      return;
    }

    async function fetchItems() {
      const { currentSort, currentRange } = getPodcastFilterParams({
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      });

      const response = await apiRequestService.reqItemGetManyWithoutLiveItemByChannel(
        channel_id,
        {
          page: filterParams.page,
          sort: currentSort,
          range: currentRange
        }
      );

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      setItems(response.data);
    }

    async function fetchClips() {
      const { currentSort, currentRange } = getPodcastFilterParams({
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      });

      const response = await apiRequestService.reqClipGetManyByChannelIdTextPublic(
        channel_id,
        {
          page: filterParams.page,
          sort: currentSort,
          range: currentRange
        }
      );

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      setClips(response.data);
    }
    
    async function fetchData() {
      setIsLoading(true);

      if (filterParams.type === "episodes") {
        await fetchItems();
      } else if (filterParams.type === "clips") {
        await fetchClips();
      }

      setIsLoading(false);
    }
    
    fetchData();
  }, [filterParams, loggedInAccount]);

  return (
    <PodcastContext.Provider value={{
      filterParams,
      setFilterParams,
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
