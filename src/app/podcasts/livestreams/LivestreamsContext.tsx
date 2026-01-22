"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DTOItem, getTotalPages, QueryParamsGetManyLivestreams, removeQueryParamByPattern } from "podverse-helpers";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useAccount } from "../../../contexts/Account";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { useFilterDefaults } from "../../../hooks/useFilterDefaults";
import { useListPageCache } from "../../../hooks/useListPageCache";
import { ROUTES } from "../../../constants/routes";
import { getEpisodesFilterParams } from "../../episodes/EpisodesDropdownConfig";

interface LivestreamsContextType {
  filterParams: QueryParamsGetManyLivestreams;
  setFilterParams: (params: QueryParamsGetManyLivestreams) => void;
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

const LivestreamsContext = createContext<LivestreamsContextType | undefined>(undefined);

interface LivestreamsContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsGetManyLivestreams,
  ssrItems: DTOItem[],
  ssrTotalPages: number,
  medium: "av" | "music"
}

export const LivestreamsContextProvider = ({
  children,
  initialQueryParams,
  ssrItems,
  ssrTotalPages,
  medium
}: LivestreamsContextProviderProps) => {
  const router = useRouter();
  
  // Use different route keys for different mediums
  const routeKey = medium === "av" ? "podcasts-livestreams" : "music-livestreams";
  
  // Use the list page cache hook for back navigation caching
  const {
    filterParams, setFilterParams,
    data: items, setData: setItems,
    totalPages, setTotalPages,
    shouldSkipFetch
  } = useListPageCache<QueryParamsGetManyLivestreams, DTOItem[]>({
    routeKey,
    initialParams: initialQueryParams,
    ssrData: ssrItems ?? [],
    ssrTotalPages,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubscribeMessage, setShowSubscribeMessage] = useState<boolean>(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  const filterDefaultsPage = medium === "av" ? "podcasts-livestreams" : "music-livestreams";
  useFilterDefaults(filterDefaultsPage, filterParams);

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

      const response = await apiRequestService.reqLiveItemGetMany({
        page: filterParams.page,
        medium,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: filterParams.category
      },
      filterParams.liveItemType
    );

      if (!filterParams.category) {
        const route = medium === "av" ? ROUTES.PODCASTS_LIVESTREAMS : ROUTES.MUSIC_LIVESTREAMS;
        router.replace(removeQueryParamByPattern(route, "category"));
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
    <LivestreamsContext.Provider value={{
      filterParams, setFilterParams,
      items, setItems,
      totalPages, setTotalPages,
      isLoading, setIsLoading,
      showSubscribeMessage, setShowSubscribeMessage,
      showCategoriesModal, setShowCategoriesModal
    }}>
      {children}
    </LivestreamsContext.Provider>
  );
};

export const useLivestreamsContext = () => {
  const ctx = useContext(LivestreamsContext);
  if (!ctx) throw new Error("useLivestreamsContext must be used within a LivestreamsContextProvider");
  return ctx;
};
