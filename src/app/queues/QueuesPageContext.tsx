"use client";

import { DTOQueue, DTOQueueResource, getQueueMediumIdFromType, MediumEnum, QueryParamsQueues } from "podverse-helpers";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      
      const currentMediumId = getQueueMediumIdFromType(filterParams.medium) || MediumEnum.AV;
      const currentQueue = ssrQueues.find(q => q.medium_id === currentMediumId);
      
      const queueData = await apiRequestService.reqQueueGetAllForAccountPrivate();
      const activeQueue = queueData.find(queue => queue.is_active_queue);

      if (currentQueue) {
        const combinedQueueResources: DTOQueueResource[] = [];

        if (activeQueue?.id_text !== currentQueue.id_text) {
          const nowPlayingResource = await apiRequestService
            .reqQueueResourcesGetNowPlayingByQueueIdText(currentQueue.id_text);
          
          if (nowPlayingResource) {
            combinedQueueResources.push(nowPlayingResource);
          }
        }

        const upcomingQueueResources = await apiRequestService
          .reqQueueResourcesGetAllUpcomingByQueueIdText(currentQueue.id_text);
        combinedQueueResources.push(...upcomingQueueResources);

        setQueueResources(combinedQueueResources);
      }

      setShowLoginMessage(false);
      setIsLoading(false);
    }

    fetchQueueResources();
  }, [filterParams, loggedInAccount]);

  return (
    <QueuesPageContext.Provider value={{
      filterParams, setFilterParams,
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
