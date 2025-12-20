"use client";

import React from "react";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { ListQueueResources } from "../../components/List/Queues/ListQueueResources";
import { useQueuesPageContext } from "./QueuesPageContext";

export const QueuesList: React.FC = () => {
  const { filterParams, queueResources, isLoading, showLoginMessage } = useQueuesPageContext();
  const { medium } = filterParams;

  return (
    <>
      <ListQueueResources
        queueMedium={medium}
        queueResources={queueResources}
        showLoginMessage={showLoginMessage}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
