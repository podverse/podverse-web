import React from "react";
import { ListPlaylists } from "../../components/List/Playlists/ListPlaylists";
import { usePlaylistsContext } from "./PlaylistsContext";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";

export const PlaylistsList: React.FC = () => {
  const { filterParams, setFilterParams, playlists, totalPages, isLoading, showLoginMessage } = usePlaylistsContext();
  const { page = 1, type } = filterParams;

  const showCreator = filterParams.type === "global";

  return (
    <>
      <ListPlaylists
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        playlists={playlists}
        totalPages={totalPages}
        showLoginMessage={showLoginMessage}
        type={type}
        showCreator={showCreator}
      />
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
