import React from "react";
import ChannelList from "../../components/Channel/ChannelsList";
import { usePodcastsContext } from "./PodcastsContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";

const PodcastsList: React.FC = () => {
  const { page = 1, setPage, channels, totalPages, isLoading, showSubscribeMessage } = usePodcastsContext();
  
  return (
    <>
      <ChannelList
        page={page}
        setPage={setPage}
        channels={channels}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};

export default PodcastsList;
