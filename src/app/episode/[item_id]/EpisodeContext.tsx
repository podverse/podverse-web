"use client";

import { useParams } from "next/navigation";
import { DTOClip, DTOItemChapter, DTOItemSoundbite, getTotalPages,
  QueryParamsItem, TranscriptRow } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAccount } from "../../../contexts/Account";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { getEpisodeFilterParams } from "./EpisodeDropdownConfig";
import { apiRequestService } from "../../../factories/apiRequestService";
import { getTranscriptRowsFromTranscriptString } from "../../../utils/transcript";

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
  const [filterParams, setFilterParams] = useState<QueryParamsItem>(initialQueryParams);
  const [itemChapters, setItemChapters] = useState<DTOItemChapter[]>([]);
  const [itemSoundbites, setItemSoundbites] = useState<DTOItemSoundbite[]>([]);
  const [clips, setClips] = useState<DTOClip[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transcriptRows, setTranscriptRows] = useState<TranscriptRow[]>([]);
  const [autoScrollOn, setAutoScrollOn] = useState<boolean>(true);
  const { loggedInAccount } = useAccount();
  
  if (!params.item_id) {
    return null
  }

  const item_id = params.item_id as string;

  useSkipInitialEffect(() => {
    if (filterParams.type === "summary") {
      return;
    }

    async function fetchItemChapters() {
      const response = await apiRequestService.reqItemParseAndGetChapters(item_id);

      const totalPages = getTotalPages(response.meta.count, response.meta.limit);
      setTotalPages(totalPages);
      
      const tocChapters = response.data.filter((ch: DTOItemChapter) => ch.table_of_contents !== false);
      setItemChapters(tocChapters);
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
