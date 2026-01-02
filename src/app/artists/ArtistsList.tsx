import React from "react";
import { ListArtists } from "../../components/List/Music/Artists/ListArtists";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useLocalSettings } from "../../contexts/LocalSettings";
import { HowToStartInfo } from "../../components/InfoWrapper/HowToStartInfo";
import { useArtistsContext } from "./ArtistsContext";

export const ArtistsList: React.FC = () => {
  const { filterParams, setFilterParams, channels, totalPages, isLoading,
    showSubscribeMessage } = useArtistsContext();
  const { viewSelected } = useLocalSettings();
  const { page, type } = filterParams;

  return (
    <>
      {
        filterParams.type === "subscribed" && (
          <HowToStartInfo
            rows={channels}
            totalPages={totalPages}
          />
        )
      }
      <ListArtists
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        channels={channels}
        totalPages={totalPages}
        showSubscribeMessage={showSubscribeMessage}
        type={type}
        viewSelected={viewSelected}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
