"use client";

import { useParams } from "next/navigation";
import { DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite, QueryParamsItem } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAccount } from "../../../contexts/Account";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";

interface EpisodeContextType {
  filterParams: QueryParamsItem;
  setFilterParams: (params: QueryParamsItem) => void;
  item: DTOItem;
  setItem: (item: DTOItem) => void;
  chapters: DTOItemChapter[];
  setChapters: (chapters: DTOItemChapter[]) => void;
  soundbites: DTOItemSoundbite[];
  setSoundbites: (soundbites: DTOItemSoundbite[]) => void;
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
  ssrItem: DTOItem
}

export const EpisodeContextProvider = ({
  children,
  initialQueryParams,
  ssrItem
}: EpisodeContextProviderProps) => {
  const params = useParams();
  const [filterParams, setFilterParams] = useState<QueryParamsItem>(initialQueryParams);
  const [item, setItem] = useState<DTOItem>(ssrItem);
  const [chapters, setChapters] = useState<DTOItemChapter[]>([]);
  const [soundbites, setSoundbites] = useState<DTOItemSoundbite[]>([]);
  const [clips, setClips] = useState<DTOClip[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<string>("");
  const { loggedInAccount } = useAccount();
  
  if (!params.item_id) {
    return null
  }

  // const item_id = params.item_id as string;

  useSkipInitialEffect(() => {
    if (
      filterParams.type === "summary"
      || filterParams.type === "transcript"
    ) {
      return;
    }

    // async function fetchClips() {
    //   const { currentSort, currentRange } = getPodcastFilterParams({
    //     type: filterParams.type,
    //     sort: filterParams.sort,
    //     range: filterParams.range
    //   });

    //   const response = await apiRequestService.reqClipGetManyByChannelIdTextPublic(
    //     channel_id,
    //     {
    //       page: filterParams.page,
    //       sort: currentSort,
    //       range: currentRange
    //     }
    //   );

    //   const totalPages = getTotalPages(response.meta.count, response.meta.limit);
    //   setTotalPages(totalPages);
    //   setClips(response.data);
    // }
    
    async function fetchData() {
      setIsLoading(true);

      // if (filterParams.type === "episodes") {
      //   await fetchItems();
      // } else if (filterParams.type === "clips") {
      //   await fetchClips();
      // }

      setIsLoading(false);
    }
    
    fetchData();
  }, [filterParams, loggedInAccount]);

  return (
    <EpisodeContext.Provider value={{
      filterParams,
      setFilterParams,
      item, setItem,
      chapters, setChapters,
      soundbites, setSoundbites,
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
