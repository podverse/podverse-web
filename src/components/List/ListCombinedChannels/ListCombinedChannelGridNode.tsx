"use client";

import { DTOChannel, MediumEnum, QueryParamsMedium } from "podverse-helpers";
import React from "react";
import { ListPodcastGridNode } from "../Podcasts/ListPodcastGridNode";
import { ListAlbumGridNode } from "../Music/Albums/ListAlbumGridNode";

interface Props {
  channel: DTOChannel;
  filterMedium: QueryParamsMedium;
}

export const ListCombinedChannelGridNode: React.FC<Props> = ({ channel, filterMedium }) => {
  if (filterMedium === 'all') {
    if (channel.medium_id === MediumEnum.Music) {
      return <ListAlbumGridNode channel={channel} />;
    } else {
      return <ListPodcastGridNode channel={channel} />;
    }
  }

  if (filterMedium === 'music') {
    return <ListAlbumGridNode channel={channel} />;
  }
  
  return <ListPodcastGridNode channel={channel} />;
};