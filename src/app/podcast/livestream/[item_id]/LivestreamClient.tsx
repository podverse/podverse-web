import { DTOChannel, DTOItem, QueryParamsLiveItem, QueryParamsQueueMedium } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../../components/Main/MainWrapper";
import { LivestreamContextProvider } from "./LivestreamContext";
import { LivestreamList } from "./LivestreamList";
import { LivestreamListHeader } from "./LivestreamListHeader";
import { MainInnerWrapper } from "../../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../../components/Main/MainInnerContentWrapper";
import { PodcastHeader } from "../../../../components/Media/Podcast/PodcastHeader";
import { SideContent } from "../../../../components/SideContent/SideContent";
import { LivestreamHeader } from "../../../../components/Media/Livestream/LivestreamHeader";

interface LivestreamClientProps {
  initialQueryParams: QueryParamsLiveItem;
  ssrChannel: DTOChannel;
  ssrItem: DTOItem;
  medium: QueryParamsQueueMedium;
}

export function LivestreamClient(props: LivestreamClientProps) {
  const { initialQueryParams, ssrItem, ssrChannel, medium } = props;

  return (
    <LivestreamContextProvider initialQueryParams={initialQueryParams}>
      <MainWrapper>
        <PodcastHeader channel={ssrChannel} item={ssrItem} />
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <LivestreamHeader channel={ssrChannel} item={ssrItem} medium={medium}  />
            <LivestreamListHeader />
            <LivestreamList ssrItem={ssrItem} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </LivestreamContextProvider>
  );
}
