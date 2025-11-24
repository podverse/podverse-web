import React from "react";
import { ListPodcasts } from "../../components/List/Podcasts/ListPodcasts";
import { usePodcastsContext } from "./PodcastsContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useLocalSettings } from "../../contexts/LocalSettings";

export const PodcastsList: React.FC = () => {
  const { filterParams, setFilterParams, channels, totalPages, isLoading,
    showSubscribeMessage } = usePodcastsContext();
  const { viewSelected } = useLocalSettings();
  const { page = 1, type, category } = filterParams;

  return (
    <>
      <ListPodcasts
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        channels={channels}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
        type={type}
        category={category}
        viewSelected={viewSelected}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
