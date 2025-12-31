import { DTOChannel, DTOClip, DTOItem, DTOItemSoundbite, QueryParamsChannel, RemoteItemsResponse } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { PodcastContextProvider } from "./PodcastContext";
import { PodcastListHeader } from "./PodcastListHeader";
import { PodcastList } from "./PodcastList";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PodcastSideContent } from "./PodcastSideContent";
import { PodcastHeader } from "../../../components/Media/Podcast/PodcastHeader";

interface PodcastClientProps {
  initialQueryParams: QueryParamsChannel;
  ssrChannel: DTOChannel;
  ssrItemsWithLiveItem: DTOItem[];
  ssrItems: DTOItem[];
  ssrItemSoundbites: DTOItemSoundbite[];
  ssrHasItemSoundbites: boolean;
  ssrClips: DTOClip[];
  ssrTotalPages: number;
  ssrPodroll: RemoteItemsResponse | null;
}

export function PodcastClient(props: PodcastClientProps) {
  const { initialQueryParams, ssrChannel, ssrItemsWithLiveItem, ssrItems,
    ssrClips, ssrItemSoundbites, ssrHasItemSoundbites, ssrTotalPages, ssrPodroll } = props;

  return (
    <PodcastContextProvider
      initialQueryParams={initialQueryParams}
      ssrItemsWithLiveItem={ssrItemsWithLiveItem}
      ssrItems={ssrItems}
      ssrClips={ssrClips}
      ssrItemSoundbites={ssrItemSoundbites}
      ssrTotalPages={ssrTotalPages}
    >
      <MainWrapper>
        <PodcastHeader channel={ssrChannel} />
        <MainInnerWrapper>
          <PodcastSideContent
            channel={ssrChannel}
            podroll={ssrPodroll}
          />
          <MainInnerContentWrapper>
            <PodcastListHeader
              ssrHasPodroll={!!ssrPodroll}
              ssrHasItemSoundbites={ssrHasItemSoundbites}
            />
            <PodcastList
              ssrChannel={ssrChannel}
              podroll={ssrPodroll} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </PodcastContextProvider>
  );
}
