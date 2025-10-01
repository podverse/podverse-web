import React from "react";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { ListQueueResources } from "../../components/List/Queues/ListQueueResources";
import { useQueuesPageContext } from "./QueuesPageContext";

export const QueuesList: React.FC = () => {
  const { queueResources, isLoading, showLoginMessage } = useQueuesPageContext();

  return (
    <>
      <ListQueueResources
        queueResources={queueResources}
        showLoginMessage={showLoginMessage}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
