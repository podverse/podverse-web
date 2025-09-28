"use client";

import { useParams } from "next/navigation";
import { DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite, getTotalPages, QueryParamsItem } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAccount } from "../../../contexts/Account";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { getEpisodeFilterParams } from "./EpisodeDropdownConfig";
import { apiRequestService } from "../../../factories/apiRequestService";

interface EpisodeContextType {
  filterParams: QueryParamsItem;
  setFilterParams: (params: QueryParamsItem) => void;
  itemChapters: DTOItemChapter[];
  setItemChapters: (itemChapters: DTOItemChapter[]) => void;
  itemSoundbites: DTOItemSoundbite[];
  setItemSoundbites: (itemSoundbites: DTOItemSoundbite[]) => void;
  clips: DTOClip[];
  setClips: (clips: DTOClip[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showSubscribeMessage: boolean;
  setShowSubscribeMessage: (show: boolean) => void;
  isCopied: string;
  setIsCopied: (isCopied: string) => void;
};

const EpisodeContext = createContext<EpisodeContextType | undefined>(undefined);

interface EpisodeContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsItem,
}

export const EpisodeContextProvider = ({
  children,
  initialQueryParams
}: EpisodeContextProviderProps) => {
  const params = useParams();
  const [filterParams, setFilterParams] = useState<QueryParamsItem>(initialQueryParams);
  const [itemChapters, setItemChapters] = useState<DTOItemChapter[]>([]);
  const [itemSoundbites, setItemSoundbites] = useState<DTOItemSoundbite[]>([]);
  const [clips, setClips] = useState<DTOClip[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<string>("");
  const { loggedInAccount } = useAccount();
  
  if (!params.item_id) {
    return null
  }

  const item_id = params.item_id as string;

  useSkipInitialEffect(() => {
    if (
      filterParams.type === "summary"
      || filterParams.type === "transcript"
    ) {
      return;
    }

    async function fetchItemChapters() {
      const response = await apiRequestService.reqItemParseAndGetChapters(
        item_id
      );

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      setItemChapters(response.data);
    }

    async function fetchSoundbites() {
      const { currentSort } = getEpisodeFilterParams({
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      });

      const response = await apiRequestService.reqItemSoundbiteGetManyByItemIdText(
        item_id,
        {
          page: filterParams.page,
          sort: currentSort === "oldest" ? "oldest" : "recent"
        }
      );

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      setItemSoundbites(response.data);
    }

    async function fetchClips() {
      const { currentSort, currentRange } = getEpisodeFilterParams({
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      });

      const response = await apiRequestService.reqClipGetManyByItemIdTextPublic(
        item_id,
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

      if (filterParams.type === "chapters") {
        await fetchItemChapters();
      } else if (filterParams.type === "soundbites") {
        await fetchSoundbites();
      } else if (filterParams.type === "clips") {
        await fetchClips();
      }

      setIsLoading(false);
    }
    
    fetchData();
  }, [filterParams, loggedInAccount]);

  return (
    <EpisodeContext.Provider value={{
      filterParams,
      setFilterParams,
      itemChapters, setItemChapters,
      itemSoundbites, setItemSoundbites,
      clips, setClips,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage,
      isCopied, setIsCopied
    }}>
      {children}
    </EpisodeContext.Provider>
  );
};

export const useEpisodeContext = () => {
  const ctx = useContext(EpisodeContext);
  if (!ctx) throw new Error("useEpisodeContext must be used within an EpisodeContextProvider");
  return ctx;
};
