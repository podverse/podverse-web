import React from "react";
import ChannelList from "../../components/Channel/ChannelList";
import { usePodcastsContext } from "./PodcastsContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";

const PodcastsList: React.FC = () => {
  const { page = 1, setPage, channels, totalPages, isLoading } = usePodcastsContext();
  
  return (
    <>
      <ChannelList
        page={page}
        setPage={setPage}
        channels={channels}
        totalPages={totalPages}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};

export default PodcastsList;
