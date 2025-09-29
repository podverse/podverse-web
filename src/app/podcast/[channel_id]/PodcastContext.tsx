"use client";

import { useParams } from "next/navigation";
import { DTOClip, DTOItem, DTOItemSoundbite, DTOLiveItem, getTotalPages, QueryParamsChannel } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useAccount } from "../../../contexts/Account";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { getPodcastFilterParams } from "./PodcastDropdownConfig";

interface PodcastContextType {
  filterParams: QueryParamsChannel;
  setFilterParams: (params: QueryParamsChannel) => void;
  liveItems: DTOLiveItem[];
  setLiveItems: (liveItems: DTOLiveItem[]) => void;
  items: DTOItem[];
  setItems: (items: DTOItem[]) => void;
  itemSoundbites: DTOItemSoundbite[];
  setItemSoundbites: (itemSoundbites: DTOItemSoundbite[]) => void;
  clips: DTOClip[];
  setClips: (clips: DTOClip[]) => void;  
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

interface PodcastContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsChannel,
  ssrLiveItems: DTOLiveItem[],
  ssrItemSoundbites?: DTOItemSoundbite[],
  ssrItems: DTOItem[],
  ssrClips: DTOClip[],
  ssrTotalPages: number
}

export const PodcastContextProvider = ({
  children,
  initialQueryParams,
  ssrLiveItems,
  ssrItemSoundbites,
  ssrItems,
  ssrClips,
  ssrTotalPages
}: PodcastContextProviderProps) => {
  const params = useParams();
  const [filterParams, setFilterParams] = useState<QueryParamsChannel>(initialQueryParams);
  const [liveItems, setLiveItems] = useState<DTOLiveItem[]>(ssrLiveItems || []);
  const [items, setItems] = useState<DTOItem[]>(ssrItems || []);
  const [itemSoundbites, setItemSoundbites] = useState<DTOItemSoundbite[]>(ssrItemSoundbites || []);
  const [clips, setClips] = useState<DTOClip[]>(ssrClips || []);
  const [totalPages, setTotalPages] = useState<number>(ssrTotalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

    async function fetchItemSoundbites() {
      const { currentSort } = getPodcastFilterParams({
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      });

      const response = await apiRequestService.reqItemSoundbiteGetManyByChannelIdText(
        channel_id,
        {
          page: filterParams.page,
          sort: currentSort !== "top" ? currentSort : "recent"
        }
      );

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      setItemSoundbites(response.data);
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
      } else if (filterParams.type === "soundbites") {
        await fetchItemSoundbites();
      }

      setIsLoading(false);
    }
    
    fetchData();
  }, [filterParams, loggedInAccount]);

  return (
    <PodcastContext.Provider value={{
      filterParams,
      setFilterParams,
      liveItems, setLiveItems,
      items, setItems,
      itemSoundbites, setItemSoundbites,
      clips, setClips,
      totalPages, setTotalPages,
      isLoading, setIsLoading
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
