import React from "react";
import { useAlbumsContext } from "./AlbumsContext";
import { ListAlbums } from "../../components/List/Music/Albums/ListAlbums";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import { useLocalSettings } from "../../contexts/LocalSettings";
import { HowToStartInfo } from "../../components/InfoWrapper/HowToStartInfo";

export const AlbumsList: React.FC = () => {
  const { filterParams, setFilterParams, channels, totalPages, isLoading,
    showSubscribeMessage } = useAlbumsContext();
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
      <ListAlbums
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
