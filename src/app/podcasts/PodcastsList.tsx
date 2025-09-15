import React from "react";
import ListPodcasts from "../../components/List/Podcasts/ListPodcasts";
import { usePodcastsContext } from "./PodcastsContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";

const PodcastsList: React.FC = () => {
  const { queryParams, setQueryParams, channels, totalPages, isLoading, showSubscribeMessage } = usePodcastsContext();
  const { page = 1, type, category } = queryParams;

  return (
    <>
      <ListPodcasts
        page={page}
        setPage={(page) => setQueryParams({ ...queryParams, page })}
        channels={channels}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
        type={type}
        category={category}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};

export default PodcastsList;
