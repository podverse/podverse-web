"use client";

import { DTOChannel, DTOItem, EpisodeByGuidResponse, PodcastBatchByFeedGuidResponse, RemoteItemsResponse } from "podverse-helpers";
import React from "react";
import { useArtistContext } from "./ArtistContext";
import { ContentAbout } from "../../../components/Content/About/ContentAbout";
import { ContentPodroll } from "../../../components/Content/Podroll/ContentPodroll";
import { ListAlbumsRemoteItems } from "../../../components/List/Music/Albums/ListAlbumsRemoteItems";
import { ListTracksRemoteItems } from "../../../components/List/Music/Albums/Tracks/ListTracksRemoteItems";
import { ListChannelSettings } from "../../../components/List/ListChannelSettings";
import styles from "../../../styles/app/podcast/PodcastList.module.scss";

type ArtistListProps = {
  podroll: RemoteItemsResponse | null;
  ssrChannel: DTOChannel;
  ssrChannelsAdded: DTOChannel[];
  ssrChannelsUnadded: PodcastBatchByFeedGuidResponse['feeds'];
  ssrItemsAdded: DTOItem[];
  ssrItemsUnadded: NonNullable<EpisodeByGuidResponse['episode']>[];
}

export const ArtistList: React.FC<ArtistListProps> = ({ podroll, ssrChannel,
  ssrChannelsAdded, ssrChannelsUnadded, ssrItemsAdded, ssrItemsUnadded
 }) => {
  const { filterParams } = useArtistContext();
  const { type } = filterParams;
  
  return (
    <div className={styles.list}>
      {
        type === "albums" && (
          <ListAlbumsRemoteItems
            channelsAdded={ssrChannelsAdded}
            channelsUnadded={ssrChannelsUnadded}
            viewSelected="rows"
          />
        )
      }
      {
        type === "tracks" && (
          <ListTracksRemoteItems
            itemsAdded={ssrItemsAdded}
            itemsUnadded={ssrItemsUnadded}
            viewSelected="rows"
          />
        )
      }
      {
        type === "about" && (
          <ContentAbout
            description={ssrChannel.channel_description?.value}
            channel_persons={ssrChannel.channel_persons}
          />
        )
      }
      {
        type === "podroll" && (
          <ContentPodroll remoteItemsResponse={podroll} />
        )
      }
      {
        type === "settings" && (
          <ListChannelSettings channel={ssrChannel} />
        )
      }
    </div>
  );
};
