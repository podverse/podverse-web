import { DTOChannel, DTOItem, QueryParamsItem } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { EpisodeContextProvider } from "./EpisodeContext";
import { EpisodeList } from "./EpisodeList";
import { EpisodeListHeader } from "./EpisodeListHeader";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PodcastHeader } from "../../../components/Media/Podcast/PodcastHeader";
import { SideContent } from "../../../components/SideContent/SideContent";
import { EpisodeHeader } from "../../../components/Media/Podcast/Episode/EpisodeHeader";

interface EpisodeClientProps {
  initialQueryParams: QueryParamsItem;
  ssrChannel: DTOChannel;
  ssrItem: DTOItem;
}

export function EpisodeClient(props: EpisodeClientProps) {
  const { initialQueryParams, ssrItem, ssrChannel } = props;

  return (
    <EpisodeContextProvider
      initialQueryParams={initialQueryParams}
      ssrItem={ssrItem}
      ssrChannel={ssrChannel}
    >
      <MainWrapper>
        <PodcastHeader channel={ssrChannel} />
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <EpisodeHeader item={ssrItem} channel={ssrChannel} />
            <EpisodeListHeader />
            <EpisodeList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </EpisodeContextProvider>
  );
}
