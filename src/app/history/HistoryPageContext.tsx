"use client";

import { DTOQueue, DTOQueueResource, getTotalPages, MediumEnum, QueryParamsHistory } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";

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
  const [filterParams, setFilterParams] = useState<QueryParamsHistory>(initialQueryParams);
  const [queueResources, setQueueResources] = useState<DTOQueueResource[]>(ssrQueueResources || []);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showLoginMessage, setShowLoginMessage] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useEffect(() => {
    async function fetchQueueResources() {
      if (!loggedInAccount) {
        setQueueResources([]);
        setShowLoginMessage(true);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      const currentMediumId = filterParams.medium_id || MediumEnum.Podcast;
      const currentQueue = ssrQueues.find(q => q.medium_id === currentMediumId);
      
      if (currentQueue) {
        const response = await apiRequestService
          .reqQueueResourcesGetHistoryByQueueIdTextPaginated(currentQueue.id_text, filterParams.page);
        setQueueResources(response.data);
        const totalPages = getTotalPages(response.meta.count, response.meta.limit);
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
