"use client";

import { DTOQueue, DTOQueueResource, getQueueMediumIdFromType, getTotalPages, QueryParamsHistory } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";
import { checkBackNavFlag } from "../../contexts/Navigation";
import { usePageStateCache } from "../../hooks/usePageStateCache";
import { getPageState } from "../../utils/pageStateCache";

// Type for cached data
interface HistoryCachedData {
  queueResources: DTOQueueResource[];
  totalPages: number;
}

interface HistoryPageContextType {
  filterParams: QueryParamsHistory;
  setFilterParams: (params: QueryParamsHistory) => void;
  queueResources: DTOQueueResource[];
  setQueueResources: (resources: DTOQueueResource[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showLoginMessage: boolean;
  setShowLoginMessage: (show: boolean) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
};

const HistoryPageContext = createContext<HistoryPageContextType | undefined>(undefined);

interface HistoryPageContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsHistory,
  ssrQueues: DTOQueue[],
  ssrQueueResources?: DTOQueueResource[]
}

export const HistoryPageContextProvider = ({
  children,
  initialQueryParams,
  ssrQueues,
  ssrQueueResources
}: HistoryPageContextProviderProps) => {
  // Use synchronous sessionStorage check instead of async React state
  const isBackNav = checkBackNavFlag();
  
  // Check for cached state on back navigation
  const cachedState = isBackNav 
    ? getPageState<QueryParamsHistory, HistoryCachedData>("history") 
    : null;
  const restoredFromCacheRef = useRef(!!cachedState?.data);
  
  const [filterParams, setFilterParams] = useState<QueryParamsHistory>(
    cachedState?.filterParams ?? initialQueryParams
  );
  const [queueResources, setQueueResources] = useState<DTOQueueResource[]>(
    cachedState?.data?.queueResources ?? ssrQueueResources ?? []
  );
  const [isLoading, setIsLoading] = useState<boolean>(!cachedState?.data); // Not loading if restored from cache
  const [totalPages, setTotalPages] = useState<number>(
    cachedState?.data?.totalPages ?? 1
  );
  const [showLoginMessage, setShowLoginMessage] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  // Hook to save/restore page state for back navigation
  usePageStateCache<QueryParamsHistory, HistoryCachedData>({
    routeKey: "history",
    filterParams,
    setFilterParams,
    data: { queueResources, totalPages },
    setData: (cached) => {
      setQueueResources(cached.queueResources);
      setTotalPages(cached.totalPages);
    },
    cachedScrollPosition: cachedState?.scrollPosition,
  });

  useEffect(() => {
    // Skip fetch if we just restored from cache - data is already correct
    if (restoredFromCacheRef.current) {
      restoredFromCacheRef.current = false;
      return;
    }

    async function fetchQueueResources() {
      if (!loggedInAccount) {
        setQueueResources([]);
        setShowLoginMessage(true);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      const currentMediumId = getQueueMediumIdFromType(filterParams.medium);
      const currentQueue = ssrQueues.find(q => q.medium_id === currentMediumId);
      
      if (currentQueue) {
        const response = await apiRequestService
          .reqQueueResourcesGetHistoryByQueueIdTextPaginated(currentQueue.id_text, filterParams.page);
        setQueueResources(response.data);
        const totalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, filterParams.page);
        setTotalPages(totalPages);
      }

      setShowLoginMessage(false);
      setIsLoading(false);
    }

    fetchQueueResources();
  }, [filterParams, loggedInAccount]);

  return (
    <HistoryPageContext.Provider value={{
      filterParams, setFilterParams,
      queueResources, setQueueResources,
      isLoading, setIsLoading,
      showLoginMessage, setShowLoginMessage,
      totalPages, setTotalPages
    }}>
      {children}
    </HistoryPageContext.Provider>
  );
};

export const useHistoryPageContext = () => {
  const ctx = useContext(HistoryPageContext);
  if (!ctx) throw new Error("useHistoryPageContext must be used within a HistoryPageContextProvider");
  return ctx;
};
