"use client";

import { useParams } from "next/navigation";
import { DTOItem, getTotalPages, QueryParamsChannelMusicAlbum } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useAccount } from "../../../contexts/Account";
import { checkBackNavFlag } from "../../../contexts/Navigation";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { usePageStateCache } from "../../../hooks/usePageStateCache";
import { getPageState } from "../../../utils/pageStateCache";
import { getAlbumFilterParams } from "./AlbumDropdownConfig";

// Type for cached data
interface AlbumCachedData {
  items: DTOItem[];
  totalPages: number;
}

interface AlbumContextType {
  filterParams: QueryParamsChannelMusicAlbum;
  setFilterParams: (params: QueryParamsChannelMusicAlbum) => void;
  items: DTOItem[];
  setItems: (items: DTOItem[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

interface AlbumContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsChannelMusicAlbum,
  ssrItemsWithLiveItem: DTOItem[],
  ssrItems: DTOItem[],
  ssrTotalPages: number
}

export const AlbumContextProvider = ({
  children,
  initialQueryParams,
  ssrItemsWithLiveItem,
  ssrItems,
  ssrTotalPages
}: AlbumContextProviderProps) => {
  const params = useParams();
  
  if (!params.channel_id) return;
  const channel_id = params.channel_id as string;
  const routeKey = `album-${channel_id}`;
  
  // Use synchronous sessionStorage check instead of async React state
  const isBackNav = checkBackNavFlag();
  
  // Check for cached state on back navigation
  const cachedState = isBackNav 
    ? getPageState<QueryParamsChannelMusicAlbum, AlbumCachedData>(routeKey) 
    : null;
  const restoredFromCacheRef = useRef(!!cachedState?.data);
  
  const [filterParams, setFilterParams] = useState<QueryParamsChannelMusicAlbum>(
    cachedState?.filterParams ?? initialQueryParams
  );
  const [items, setItems] = useState<DTOItem[]>(
    cachedState?.data?.items ?? ssrItems ?? []
  );
  const [totalPages, setTotalPages] = useState<number>(
    cachedState?.data?.totalPages ?? ssrTotalPages ?? 1
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  // Hook to save/restore page state for back navigation
  usePageStateCache<QueryParamsChannelMusicAlbum, AlbumCachedData>({
    routeKey,
    filterParams,
    setFilterParams,
    data: { items, totalPages },
    setData: (cached) => {
      setItems(cached.items);
      setTotalPages(cached.totalPages);
    },
    cachedScrollPosition: cachedState?.scrollPosition,
  });

  useSkipInitialEffect(() => {
    // Skip fetch if we just restored from cache - data is already correct
    if (restoredFromCacheRef.current) {
      restoredFromCacheRef.current = false;
      return;
    }

    if (filterParams.type === "about" || filterParams.type === "podroll") {
      return;
    }

    async function fetchItems() {
      const { currentPage, currentSort, currentRange } = getAlbumFilterParams({
        page: filterParams.page,
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range
      });

      const response = await apiRequestService.reqItemGetManyByChannelBySeason(
        {
          idOrIdText: channel_id,
          page: currentPage,
          sort: currentSort,
          range: currentRange
        }
      );

      const items = ssrItemsWithLiveItem.length > 0 && filterParams.page === 1
        ? [...ssrItemsWithLiveItem, ...response.data]
        : response.data;

      const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);
      setTotalPages(totalPages);
      setItems(items);
    }
    
    async function fetchData() {
      setIsLoading(true);

      if (filterParams.type === "tracks") {
        await fetchItems();
      }

      setIsLoading(false);
    }
    
    fetchData();
  }, [filterParams, loggedInAccount]);

  return (
    <AlbumContext.Provider value={{
      filterParams,
      setFilterParams,
      items, setItems,
      totalPages, setTotalPages,
      isLoading, setIsLoading
    }}>
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbumContext = () => {
  const ctx = useContext(AlbumContext);
  if (!ctx) throw new Error("useAlbumContext must be used within a AlbumContextProvider");
  return ctx;
};
