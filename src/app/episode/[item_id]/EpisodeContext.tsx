"use client";

import { useParams } from "next/navigation";
import { DTOClip, DTOItemChapter, DTOItemSoundbite, getTotalPages,
  QueryParamsItem, TranscriptRow } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
import { useAccount } from "../../../contexts/Account";
import { checkBackNavFlag } from "../../../contexts/Navigation";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { usePageStateCache } from "../../../hooks/usePageStateCache";
import { getPageState } from "../../../utils/pageStateCache";
import { getEpisodeFilterParams } from "./EpisodeDropdownConfig";
import { apiRequestService } from "../../../factories/apiRequestService";
import { getTranscriptRowsFromTranscriptString } from "../../../utils/transcript";

// Type for cached data
interface EpisodeCachedData {
  itemChapters: DTOItemChapter[];
  itemSoundbites: DTOItemSoundbite[];
  clips: DTOClip[];
  totalPages: number;
  transcriptRows: TranscriptRow[];
}

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
  transcriptRows: TranscriptRow[];
  setTranscriptRows: (transcriptRows: TranscriptRow[]) => void;
  autoScrollOn: boolean;
  setAutoScrollOn: (autoScrollOn: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
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
  
  if (!params.item_id) {
    return null
  }

  const item_id = params.item_id as string;
  const routeKey = `episode-${item_id}`;
  
  // Use synchronous sessionStorage check instead of async React state
  const isBackNav = checkBackNavFlag();
  
  // Check for cached state on back navigation
  const cachedState = isBackNav 
    ? getPageState<QueryParamsItem, EpisodeCachedData>(routeKey) 
    : null;
  const restoredFromCacheRef = useRef(!!cachedState?.data);
  
  const [filterParams, setFilterParams] = useState<QueryParamsItem>(
    cachedState?.filterParams ?? initialQueryParams
  );
  const [itemChapters, setItemChapters] = useState<DTOItemChapter[]>(
    cachedState?.data?.itemChapters ?? []
  );
  const [itemSoundbites, setItemSoundbites] = useState<DTOItemSoundbite[]>(
    cachedState?.data?.itemSoundbites ?? []
  );
  const [clips, setClips] = useState<DTOClip[]>(
    cachedState?.data?.clips ?? []
  );
  const [totalPages, setTotalPages] = useState<number>(
    cachedState?.data?.totalPages ?? 1
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transcriptRows, setTranscriptRows] = useState<TranscriptRow[]>(
    cachedState?.data?.transcriptRows ?? []
  );
  const [autoScrollOn, setAutoScrollOn] = useState<boolean>(true);
  const { loggedInAccount } = useAccount();

  // Hook to save/restore page state for back navigation
  usePageStateCache<QueryParamsItem, EpisodeCachedData>({
    routeKey,
    filterParams,
    setFilterParams,
    data: { itemChapters, itemSoundbites, clips, totalPages, transcriptRows },
    setData: (cached) => {
      setItemChapters(cached.itemChapters);
      setItemSoundbites(cached.itemSoundbites);
      setClips(cached.clips);
      setTotalPages(cached.totalPages);
      setTranscriptRows(cached.transcriptRows);
    },
    cachedScrollPosition: cachedState?.scrollPosition,
  });

  useSkipInitialEffect(() => {
    // Skip fetch if we just restored from cache - data is already correct
    if (restoredFromCacheRef.current) {
      restoredFromCacheRef.current = false;
      return;
    }

    if (filterParams.type === "summary") {
      return;
    }

    async function fetchItemChapters() {
      const response = await apiRequestService.reqItemParseAndGetChapters(item_id);

      const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, 1);
      setTotalPages(totalPages);
      
      const tocChapters = response.data.filter((ch: DTOItemChapter) => ch.table_of_contents !== false);
      setItemChapters(tocChapters);
    }

    async function fetchSoundbites() {
      const { currentSort } = getEpisodeFilterParams({
        page: filterParams.page,
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

      const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, filterParams.page);
      setTotalPages(totalPages);
      setItemSoundbites(response.data);
    }

    async function fetchClips() {
      const { currentSort, currentRange } = getEpisodeFilterParams({
        page: filterParams.page,
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      });

      const response = await apiRequestService.reqClipGetManyByItemPublic(
        {
          idOrIdText: item_id,
          page: filterParams.page,
          sort: currentSort,
          range: currentRange
        }
      );

      const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, filterParams.page);
      setTotalPages(totalPages);
      setClips(response.data);
    }

    async function fetchTranscript() {
      const response = await apiRequestService.reqItemTranscriptGet(item_id);
      const rows = await getTranscriptRowsFromTranscriptString(response.data);
      setTranscriptRows(rows);
    }
    
    async function fetchData() {
      setIsLoading(true);

      if (filterParams.type === "chapters") {
        await fetchItemChapters();
      } else if (filterParams.type === "soundbites") {
        await fetchSoundbites();
      } else if (filterParams.type === "clips") {
        await fetchClips();
      } else if (filterParams.type === "transcript") {
        await fetchTranscript();
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
      transcriptRows, setTranscriptRows,
      autoScrollOn, setAutoScrollOn,
      isLoading, setIsLoading
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
