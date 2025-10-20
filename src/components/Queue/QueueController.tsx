"use client";

import { useEffect } from "react";
import { useQueueResourcesLoadActive } from "../../hooks/useQueueResourcesLoadActive";

export const QueueController: React.FC = () => {
  const queueResourcesLoadActive = useQueueResourcesLoadActive();

  useEffect(() => {
    queueResourcesLoadActive();
  }, []);

  return null;
};
