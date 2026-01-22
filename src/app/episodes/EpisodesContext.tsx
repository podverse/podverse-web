"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DTOItem, getTotalPages, QueryParamsGetManyPartial, removeQueryParamByPattern } from "podverse-helpers";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";
import { useFilterDefaults } from "../../hooks/useFilterDefaults";
import { useListPageCache } from "../../hooks/useListPageCache";
import { ROUTES } from "../../constants/routes";
import { getEpisodesFilterParams } from "./EpisodesDropdownConfig";

interface EpisodesContextType {
  filterParams: QueryParamsGetManyPartial;
  setFilterParams: (params: QueryParamsGetManyPartial) => void;
  items: DTOItem[];
  setItems: (items: DTOItem[]) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showSubscribeMessage: boolean;
  setShowSubscribeMessage: (show: boolean) => void;
  showCategoriesModal: boolean;
  setShowCategoriesModal: (show: boolean) => void;
};

const EpisodesContext = createContext<EpisodesContextType | undefined>(undefined);

interface EpisodesContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsGetManyPartial,
  ssrItems: DTOItem[],
  ssrTotalPages: number
}

export const EpisodesContextProvider = ({
  children,
  initialQueryParams,
  ssrItems,
  ssrTotalPages
}: EpisodesContextProviderProps) => {
  const router = useRouter();
  
  // Use the list page cache hook for back navigation caching
  const {
    filterParams, setFilterParams,
    data: items, setData: setItems,
    totalPages, setTotalPages,
    shouldSkipFetch
  } = useListPageCache<QueryParamsGetManyPartial, DTOItem[]>({
    routeKey: "episodes",
    initialParams: initialQueryParams,
    ssrData: ssrItems ?? [],
    ssrTotalPages,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();
  const medium = "av";

  useFilterDefaults('episodes', filterParams);

  useSkipInitialEffect(() => {
    // Skip fetch if we just restored from cache - data is already correct
    if (shouldSkipFetch.current) {
      shouldSkipFetch.current = false;
      return;
    }

    async function fetchItems() {
      if (filterParams.type === "subscribed") {
        if (!loggedInAccount) {
          setItems([]);
          setShowSubscribeMessage(true);
          return;
        }
      }

      setIsLoading(true);
      
      const { currentSort, currentRange, currentType } = getEpisodesFilterParams({
        page: filterParams.page,
        type: filterParams.type,
        sort: filterParams.sort,
        range: filterParams.range,
        category: filterParams.category
      }, !!loggedInAccount);

      const response = await apiRequestService.reqItemGetMany({
        page: filterParams.page,
        medium,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: filterParams.category
      });

      if (!filterParams.category) {
        router.replace(removeQueryParamByPattern(ROUTES.EPISODES, "category"));
      }

      const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, filterParams.page);
      setTotalPages(totalPages);
      setItems(response.data);
      setShowSubscribeMessage(false);
      setIsLoading(false);
    }
    fetchItems();
  }, [filterParams, loggedInAccount]);

  return (
    <EpisodesContext.Provider value={{
      filterParams, setFilterParams,
      items, setItems,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage,
      showCategoriesModal, setShowCategoriesModal
    }}>
      {children}
    </EpisodesContext.Provider>
  );
};

export const useEpisodesContext = () => {
  const ctx = useContext(EpisodesContext);
  if (!ctx) throw new Error("useEpisodesContext must be used within a EpisodesContextProvider");
  return ctx;
};
