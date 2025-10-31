"use client";

import { DTOPlaylist, DTOPlaylistResource, MediumEnum } from "podverse-helpers";
import React from "react";
import ListEpisodeRow from "../Podcasts/Episodes/ListEpisodeRow";
import { ListClipRow } from "../Clips/ListClipRow";
import { ListItemSoundbiteRow } from "../ItemSoundbites/ListItemSoundbiteRow";

interface Props {
  playlist: DTOPlaylist;
  playlistResource: DTOPlaylistResource;
  removeFromPlaylist?: () => void;
  isEditModePlaylist: boolean;
}

export const ListPlaylistResourceRow: React.FC<Props> = ({ playlist,
  playlistResource, removeFromPlaylist, isEditModePlaylist }) => {
  const item = playlistResource.item;
  const clip = playlistResource.clip;
  const item_soundbite = playlistResource.item_soundbite;
  
  if (item) {
    const channel = item.channel;

    if (channel) {
      if (channel.medium_id === MediumEnum.Podcast) {
        return (
          <ListEpisodeRow
            channel={channel}
            item={item}
            showChannelInfo
            isEditModePlaylist={isEditModePlaylist}
            removeFromPlaylist={removeFromPlaylist}
            playlist_id_text={playlist.id_text}
          />
        )
      }
    }
  } else if (clip) {
    const item = clip.item;
    const channel = item?.channel;

    if (channel) {
      if (channel.medium_id === MediumEnum.Podcast) {
        return (
          <ListClipRow
            channel={channel}
            item={item}
            clip={clip}
            showChannelInfo
            showItemInfo
            isEditModePlaylist={isEditModePlaylist}
            removeFromPlaylist={removeFromPlaylist}
            playlist_id_text={playlist.id_text}
          />
        )
      }
    }
  } else if (item_soundbite) {
    const item = item_soundbite.item;
    const channel = item?.channel;

    if (channel) {
      return (
        <ListItemSoundbiteRow
          channel={channel}
          item={item}
          item_soundbite={item_soundbite}
          showChannelInfo
          showItemInfo
          isEditModePlaylist={isEditModePlaylist}
          removeFromPlaylist={removeFromPlaylist}
          playlist_id_text={playlist.id_text}
        />
      )
    }
  }

  return null;

};
