import { DTOChannel, DTOClip, DTOItem, DTOLiveItem, DTOPodroll, QueryParamsChannel } from "podverse-helpers";
import React from "react";
import MainWrapper from "../../../components/Main/MainWrapper";
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
  ssrLiveItems: DTOLiveItem[];
  ssrItems: DTOItem[];
  ssrClips: DTOClip[];
  ssrTotalPages: number;
  ssrPodroll?: DTOPodroll | null;
}

export function PodcastClient(props: PodcastClientProps) {
  const { initialQueryParams, ssrChannel, ssrLiveItems, ssrItems, ssrClips, ssrTotalPages, ssrPodroll } = props;

  return (
    <PodcastContextProvider
      initialQueryParams={initialQueryParams}
      ssrChannel={ssrChannel}
      ssrLiveItems={ssrLiveItems}
      ssrItems={ssrItems}
      ssrClips={ssrClips}
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
            <PodcastListHeader />
            <PodcastList podroll={ssrPodroll} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </PodcastContextProvider>
  );
}
