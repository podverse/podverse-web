import { QueueResourcesAbridgedIndex } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

type QueueResourcesAbridgedContextType = {
  queueResourcesAbridgedIndex: QueueResourcesAbridgedIndex;
  setQueueResourcesAbridgedIndex: (val: QueueResourcesAbridgedIndex) => void;
};

export const QueueResourcesAbridgedIndexContext = createContext<QueueResourcesAbridgedContextType>({
  queueResourcesAbridgedIndex: {
    items: {},
    clips: {},
    item_soundbites: {},
    add_by_rss_resource_datas: {}
  },
  setQueueResourcesAbridgedIndex: () => {}
});

type QueueResourcesAbridgedIndexProviderProps = {
  children: ReactNode;
  ssrQueueResourcesAbridgedIndex: QueueResourcesAbridgedIndex | null;
};

export const QueueResourcesAbridgedIndexProvider = ({
  children,
  ssrQueueResourcesAbridgedIndex
}: QueueResourcesAbridgedIndexProviderProps) => {
  const defaultIndex = {
    items: {},
    clips: {},
    item_soundbites: {},
    add_by_rss_resource_datas: {}
  };

  const [queueResourcesAbridgedIndex, setQueueResourcesAbridgedIndex] = useState<QueueResourcesAbridgedIndex>(
    ssrQueueResourcesAbridgedIndex || defaultIndex
  );

  return (
    <QueueResourcesAbridgedIndexContext.Provider
      value={{
        queueResourcesAbridgedIndex, setQueueResourcesAbridgedIndex
      }}>
      {children}
    </QueueResourcesAbridgedIndexContext.Provider>
  );
};

export function useQueueResourcesAbridgedIndex() {
  const ctx = useContext(QueueResourcesAbridgedIndexContext);
  if (!ctx) throw new Error("useQueueResourcesAbridgedIndex must be used within a QueueResourcesAbridgedIndexProvider");
  return ctx;
}
