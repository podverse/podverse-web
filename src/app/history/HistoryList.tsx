import React from "react";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useHistoryPageContext } from "./HistoryPageContext";
import { ListHistoryResources } from "../../components/List/Queues/ListHistoryResources";

export const HistoryList: React.FC = () => {
  const { filterParams, setFilterParams, queueResources, isLoading, showLoginMessage,
    totalPages } = useHistoryPageContext();
  const { page } = filterParams;

  return (
    <>
      <ListHistoryResources
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        totalPages={totalPages}
        queueResources={queueResources}
        showLoginMessage={showLoginMessage}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
