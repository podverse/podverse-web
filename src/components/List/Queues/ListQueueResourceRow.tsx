"use client";

import { DTOQueueResource, MediumEnum } from "podverse-helpers";
import React from "react";
import ListEpisodeRow from "../Podcasts/Episodes/ListEpisodeRow";
import { ListClipRow } from "../Clips/ListClipRow";
import { ListItemSoundbiteRow } from "../ItemSoundbites/ListItemSoundbiteRow";

interface Props {
  queueResource: DTOQueueResource;
}

export const ListQueueResourceRow: React.FC<Props> = ({ queueResource }) => {
  const item = queueResource.item;
  const clip = queueResource.clip;
  const item_soundbite = queueResource.item_soundbite;
  const isEditing = true;

  if (item) {
    const channel = item.channel;

    if (channel) {
      if (channel.medium_id === MediumEnum.Podcast) {
        return (
          <ListEpisodeRow
            channel={channel}
            item={item}
            showChannelInfo
            isEditing={isEditing}
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
          isEditing={isEditing}
        />
      )
    }
  }

  return null;

};
