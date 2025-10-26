"use client";

import { useEffect } from "react";
import { useQueueResourcesAbridgedLoad } from "../../hooks/useQueueResourcesAbridgedIndexLoad";

export const QueueResourcesAbridgedController: React.FC = () => {
  const queueResourcesAbridgedLoad = useQueueResourcesAbridgedLoad();

  useEffect(() => {
    queueResourcesAbridgedLoad();
  }, []);

  return null;
};
