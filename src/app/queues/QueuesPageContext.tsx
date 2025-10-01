"use client";

import { DTOQueue, DTOQueueResource, MediumEnum, QueryParamsQueues } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useAccount } from "../../contexts/Account";

interface QueuesPageContextType {
  filterParams: QueryParamsQueues;
  setFilterParams: (params: QueryParamsQueues) => void;
  queueResources: DTOQueueResource[];
  setQueueResources: (resources: DTOQueueResource[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showLoginMessage: boolean;
  setShowLoginMessage: (show: boolean) => void;
};

const QueuesPageContext = createContext<QueuesPageContextType | undefined>(undefined);

interface QueuesPageContextProviderProps {
  children: ReactNode,
  initialQueryParams: QueryParamsQueues,
  ssrQueues: DTOQueue[],
  ssrQueueResources?: DTOQueueResource[]
}

export const QueuesPageContextProvider = ({
  children,
  initialQueryParams,
  ssrQueues,
  ssrQueueResources
}: QueuesPageContextProviderProps) => {
  const [filterParams, setFilterParams] = useState<QueryParamsQueues>(initialQueryParams);
  const [queueResources, setQueueResources] = useState<DTOQueueResource[]>(ssrQueueResources || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginMessage, setShowLoginMessage] = useState<boolean>(false);
  const { loggedInAccount } = useAccount();

  useEffect(() => {
    async function fetchQueueResources() {
      if (!loggedInAccount) {
        setQueueResources([]);
        setShowLoginMessage(true);
        return;
      }
      
      setIsLoading(true);
      
      const currentMediumId = filterParams.medium_id || MediumEnum.Podcast;
      const currentQueue = ssrQueues.find(q => q.medium_id === currentMediumId);
      
      const queueResources = await apiRequestService
        .reqQueueGetAllNowPlayingOrUpcomingByQueueIdText(currentQueue?.id_text);
      setQueueResources(queueResources || []);
      setShowLoginMessage(false);
      setIsLoading(false);
    }

    fetchQueueResources();
  }, [filterParams, loggedInAccount]);

  return (
    <QueuesPageContext.Provider value={{
      filterParams,
      setFilterParams,
      queueResources, setQueueResources,
      isLoading, setIsLoading,
      showLoginMessage, setShowLoginMessage,
    }}>
      {children}
    </QueuesPageContext.Provider>
  );
};

export const useQueuesPageContext = () => {
  const ctx = useContext(QueuesPageContext);
  if (!ctx) throw new Error("useQueuesPageContext must be used within a QueuesPageContextProvider");
  return ctx;
};
