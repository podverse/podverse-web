"use client";

import { DTOQueueResource, MediumEnum } from "podverse-helpers";
import React from "react";
import ListEpisodeRow from "../Podcasts/Episodes/ListEpisodeRow";
import { ListClipRow } from "../Clips/ListClipRow";
import { ListItemChapterRow } from "../ItemChapters/ListItemChapterRow";
import { ListItemSoundbiteRow } from "../ItemSoundbites/ListItemSoundbiteRow";

interface Props {
  queueResource: DTOQueueResource;
}

export const ListQueueResourceRow: React.FC<Props> = ({ queueResource }) => {
  const item = queueResource.item;
  const clip = queueResource.clip;
  const item_chapter = queueResource.item_chapter;
  const item_soundbite = queueResource.item_soundbite;

  if (item) {
    const channel = item.channel;

    if (channel) {
      if (channel.medium_id === MediumEnum.Podcast) {
        return (
          <ListEpisodeRow
            channel={channel}
            item={item}
            showChannelInfo
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
  } else if (item_chapter) {
    const item = item_chapter?.item_chapters_feed?.item;
    const channel = item?.channel;

    if (channel) {
      return (
        <ListItemChapterRow
          channel={channel}
          item={item}
          item_chapter={item_chapter}
        />
      )
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
        />
      )
    }
  }

  return null;

};
