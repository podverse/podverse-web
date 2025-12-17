import React from "react";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useLocalSettings } from "../../contexts/LocalSettings";
import { useTracksContext } from "./TracksContext";
import { ListTracks } from "../../components/List/Music/Albums/Tracks/ListTracks";
import { HowToStartInfo } from "../../components/InfoWrapper/HowToStartInfo";

export const TracksList: React.FC = () => {
  const { filterParams, setFilterParams, items, totalPages, isLoading,
    showSubscribeMessage } = useTracksContext();
  const { viewSelected } = useLocalSettings();
  const { page, type } = filterParams;

  return (
    <>
      {
        type === "subscribed" && (
          <HowToStartInfo
            rows={items}
            totalPages={totalPages}
          />
        )
      }
      <ListTracks
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        channel={null}
        items={items}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
        viewSelected={viewSelected}
        showChannelInfo
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
