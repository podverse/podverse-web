import { DTOQueue, DTOQueueResource } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

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
  const [activeQueueUpcomingResources, setActiveQueueUpcomingResources] = useState<DTOQueueResource[]>([]);

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
