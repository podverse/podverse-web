import { DTOQueue, DTOQueueResource } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

type QueuesContextType = {
  queues: DTOQueue[];
  setQueues: (val: DTOQueue[]) => void;
  activeQueue: DTOQueue | null;
  setActiveQueue: (val: DTOQueue | null) => void;
  activeQueueUpcomingResources: DTOQueueResource[];
  setActiveQueueUpcomingResources: (val: DTOQueueResource[]) => void;
};

export const QueuesContext = createContext<QueuesContextType>({
  queues: [],
  setQueues: () => {},
  activeQueue: null,
  setActiveQueue: () => {},
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
  const [activeQueue, setActiveQueue] = useState<DTOQueue | null>(null);
  const [activeQueueUpcomingResources, setActiveQueueUpcomingResources] = useState<DTOQueueResource[]>([]);

  return (
    <QueuesContext.Provider
      value={{
        queues, setQueues,
        activeQueue, setActiveQueue,
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
