import { DTOQueue } from "podverse-helpers";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useContext } from "react";
import { apiRequestService } from "../factories/apiRequestService";

type QueuesContextType = {
  queues: DTOQueue[];
  setQueues: (val: DTOQueue[]) => void;
};

export const QueuesContext = createContext<QueuesContextType>({
  queues: [],
  setQueues: () => {},
});

type QueuesProviderProps = {
  children: ReactNode;
};

export const QueuesProvider = ({
  children
}: QueuesProviderProps) => {
  const [queues, setQueues] = useState<DTOQueue[]>([]);

  useEffect(() => {
    (async () => {
      const data = await apiRequestService.reqQueueGetAllForAccountPrivate();
      setQueues(data);
    })();
  }, []);

  return (
    <QueuesContext.Provider
      value={{ queues, setQueues }}>
      {children}
    </QueuesContext.Provider>
  );
};

export function useQueues() {
  const ctx = useContext(QueuesContext);
  if (!ctx) throw new Error("useQueues must be used within a QueuesProvider");
  return ctx;
}
