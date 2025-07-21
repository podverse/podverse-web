import React from "react";
import ChannelList from "../../components/Channel/ChannelsList";
import { usePodcastsContext } from "./PodcastsContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";

const PodcastsList: React.FC = () => {
  const { queryParams, setQueryParams, channels, totalPages, isLoading, showSubscribeMessage } = usePodcastsContext();
  const { page = 1 } = queryParams;

  return (
    <>
      <ChannelList
        page={page}
        setPage={(page) => setQueryParams({ ...queryParams, page })}
        channels={channels}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};

export default PodcastsList;
