import { DTOQueue, DTOQueueResource, MediumEnum } from "podverse-helpers";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useContext } from "react";
import { apiRequestService } from "../factories/apiRequestService";
import { useAccount } from "./Account";

type QueuesContextType = {
  queues: DTOQueue[];
  setQueues: (val: DTOQueue[]) => void;
  activeQueueUpcomingResources: DTOQueueResource[];
  setActiveQueueUpcomingResources: (val: DTOQueueResource[]) => void;
};

export const QueuesContext = createContext<QueuesContextType>({
  queues: [],
  setQueues: () => {},
  activeQueueUpcomingResources: [],
  setActiveQueueUpcomingResources: () => {}
});

type QueuesProviderProps = {
  children: ReactNode;
};

export const QueuesProvider = ({
  children
}: QueuesProviderProps) => {
  const [queues, setQueues] = useState<DTOQueue[]>([]);
  const [activeQueueUpcomingResources, setActiveQueueUpcomingResources] = useState<any[]>([]);
  const { loggedInAccount } = useAccount();

  useEffect(() => {
    (async () => {
      if (!loggedInAccount) {
        setQueues([]);
        return;
      }
      const queueData = await apiRequestService.reqQueueGetAllForAccountPrivate();
      setQueues(queueData);

      let activeQueue = queueData.find(queue => queue.is_active_queue);
      if (!activeQueue) {
        activeQueue = queueData.find(queue => queue.medium_id === MediumEnum.Podcast)
      }

      if (activeQueue) {
        const combinedQueueResources: DTOQueueResource[] = [];

        const nowPlayingResource = await apiRequestService
          .reqQueueGetNowPlayingByQueueIdText(activeQueue.id_text);
        
        if (nowPlayingResource) {
          const upcomingQueueResources = await apiRequestService
            .reqQueueGetAllUpcomingByQueueIdText(activeQueue.id_text);
          combinedQueueResources.push(nowPlayingResource, ...upcomingQueueResources);
        }

        setActiveQueueUpcomingResources(combinedQueueResources);
      }
    })();
  }, []);

  return (
    <QueuesContext.Provider
      value={{
        queues, setQueues,
        activeQueueUpcomingResources, setActiveQueueUpcomingResources
      }}>
      {children}
    </QueuesContext.Provider>
  );
};

export function useQueues() {
  const ctx = useContext(QueuesContext);
  if (!ctx) throw new Error("useQueues must be used within a QueuesProvider");
  return ctx;
}
