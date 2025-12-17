"use client";

import { DTOChannel, MediumEnum, QueryParamsMedium } from "podverse-helpers";
import React from "react";
import { ListPodcastRow } from "../Podcasts/ListPodcastRow";
import { ListAlbumRow } from "../Music/Albums/ListAlbumRow";

interface Props {
  channel: DTOChannel;
  filterMedium: QueryParamsMedium;
}

export const ListCombinedChannelRow: React.FC<Props> = ({ channel, filterMedium }) => {
  console.log('ListCombinedChannelRow render', { channel, filterMedium });

  if (filterMedium === 'all') {
    if (channel.medium_id === MediumEnum.Music) {
      return <ListAlbumRow channel={channel} />;
    } else {
      return <ListPodcastRow channel={channel} />;
    }
  }

  if (filterMedium === 'music') {
    return <ListAlbumRow channel={channel} />;
  }
  
  return <ListPodcastRow channel={channel} />;
};