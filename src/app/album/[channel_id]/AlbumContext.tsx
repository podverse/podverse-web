"use client";

import { useParams } from "next/navigation";
import { DTOItem, getTotalPages, QueryParamsChannelMusic } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useAccount } from "../../../contexts/Account";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { getAlbumFilterParams } from "./AlbumDropdownConfig";

interface AlbumContextType {
  filterParams: QueryParamsChannelMusic;
  setFilterParams: (params: QueryParamsChannelMusic) => void;
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
  initialQueryParams: QueryParamsChannelMusic,
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
  const [filterParams, setFilterParams] = useState<QueryParamsChannelMusic>(initialQueryParams);
  const [items, setItems] = useState<DTOItem[]>(ssrItems || []);
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
