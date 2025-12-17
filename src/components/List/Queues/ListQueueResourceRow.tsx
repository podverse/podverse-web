"use client";

import { DTOQueueResource, MediumEnum } from "podverse-helpers";
import React from "react";
import ListEpisodeRow from "../Podcasts/Episodes/ListEpisodeRow";
import { ListClipRow } from "../Clips/ListClipRow";
import { ListItemSoundbiteRow } from "../ItemSoundbites/ListItemSoundbiteRow";
import { ListTrackRow } from "../Music/Albums/Tracks/ListTrackRow";

interface Props {
  queueResource: DTOQueueResource;
  removeFromQueue?: () => void;
  isEditModeQueue: boolean;
}

export const ListQueueResourceRow: React.FC<Props> = ({ queueResource, removeFromQueue, isEditModeQueue }) => {
  const item = queueResource.item;
  const clip = queueResource.clip;
  const item_soundbite = queueResource.item_soundbite;

  if (item) {
    const channel = item.channel;

    if (channel) {
      if (channel.medium_id === MediumEnum.Podcast || channel.medium_id === MediumEnum.Video) {
        return (
          <ListEpisodeRow
            channel={channel}
            item={item}
            showChannelInfo
            isEditModeQueue={isEditModeQueue}
            removeFromQueue={removeFromQueue}
          />
        )
      } else if (channel.medium_id === MediumEnum.Music) {
        return (
          <ListTrackRow
            channel={channel}
            item={item}
            showChannelInfo
            isEditModeQueue={isEditModeQueue}
            removeFromQueue={removeFromQueue}
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
            isEditModeQueue={isEditModeQueue}
            removeFromQueue={removeFromQueue}
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
          isEditModeQueue={isEditModeQueue}
          removeFromQueue={removeFromQueue}
        />
      )
    }
  }

  return null;

};
