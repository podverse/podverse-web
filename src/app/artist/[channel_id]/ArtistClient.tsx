import { DTOChannel, DTOItem, EpisodeByGuidResponse, PodcastBatchByFeedGuidResponse, QueryParamsChannelMusicArtist, RemoteItemsResponse } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { ArtistContextProvider } from "./ArtistContext";
import { ArtistListHeader } from "./ArtistListHeader";
import { ArtistList } from "./ArtistList";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { ArtistSideContent } from "./ArtistSideContent";
import { ArtistHeader } from "../../../components/Media/Music/Artist/ArtistHeader";

interface ArtistClientProps {
  initialQueryParams: QueryParamsChannelMusicArtist;
  ssrChannel: DTOChannel;
  ssrChannelsAdded: DTOChannel[];
  ssrChannelsUnadded: PodcastBatchByFeedGuidResponse['feeds'];
  ssrItemsAdded: DTOItem[];
  ssrItemsUnadded: NonNullable<EpisodeByGuidResponse['episode']>[];
  ssrPodroll: RemoteItemsResponse | null;
}

export function ArtistClient(props: ArtistClientProps) {
  const { initialQueryParams, ssrChannel, ssrChannelsAdded, ssrChannelsUnadded, ssrItemsAdded,
    ssrItemsUnadded, ssrPodroll } = props;
  const ssrHasAlbums = ssrChannelsAdded.length > 0 || ssrChannelsUnadded.length > 0;
  const ssrHasTracks = ssrItemsAdded.length > 0 || ssrItemsUnadded.length > 0;
  const ssrHasDescription = !!ssrChannel.channel_description;
  const ssrHasPodroll = !!ssrPodroll;
  
  return (
    <ArtistContextProvider initialQueryParams={initialQueryParams}>
      <MainWrapper>
        <ArtistHeader channel={ssrChannel} />
        <MainInnerWrapper>
          <ArtistSideContent
            channel={ssrChannel}
            podroll={ssrPodroll}
          />
          <MainInnerContentWrapper>
            <ArtistListHeader
              ssrHasAlbums={ssrHasAlbums}
              ssrHasTracks={ssrHasTracks}
              ssrHasDescription={ssrHasDescription}
              ssrHasPodroll={ssrHasPodroll}
            />
            <ArtistList
              ssrChannel={ssrChannel}
              ssrChannelsAdded={ssrChannelsAdded}
              ssrChannelsUnadded={ssrChannelsUnadded}
              ssrItemsAdded={ssrItemsAdded}
              ssrItemsUnadded={ssrItemsUnadded}
              podroll={ssrPodroll} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </ArtistContextProvider>
  );
}
