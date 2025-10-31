"use client";

import React from "react";
import { ListPlaylistResources } from "../../../../components/List/Playlists/ListPlaylistResources";
import { usePlaylistEditContext } from "./PlaylistEditContext";
import { DTOPlaylist } from "podverse-helpers";

type PlaylistEditListProps = {
  ssrPlaylist: DTOPlaylist;
}

export const PlaylistEditList: React.FC<PlaylistEditListProps> = ({ ssrPlaylist }) => {
  const { playlistResources, tabSelectedKey } = usePlaylistEditContext();

  if (tabSelectedKey !== "items") {
    return null;
  }

  return (
    <ListPlaylistResources
      playlist={ssrPlaylist}
      playlistResources={playlistResources}
      isEditMode
    />
  );
};
