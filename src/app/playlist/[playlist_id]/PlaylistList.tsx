"use client";

import React from "react";
import { ListPlaylistResources } from "../../../components/List/Playlists/ListPlaylistResources";
import { usePlaylistContext } from "./PlaylistContext";
import { DTOPlaylist } from "podverse-helpers";

type PlaylistListProps = {
  ssrPlaylist: DTOPlaylist;
}

export const PlaylistList: React.FC<PlaylistListProps> = ({ ssrPlaylist }) => {
  const { playlistResources, totalPages, filterParams, setFilterParams } = usePlaylistContext();
  const { page = 1 } = filterParams;

  return (
    <>
      <ListPlaylistResources
        playlist={ssrPlaylist}
        playlistResources={playlistResources}
        page={page}
        setPage={(page) => setFilterParams({ ...filterParams, page })}
        totalPages={totalPages}
      />
    </>
  );
};
