import { DTOItem, QueryParamsItem } from "podverse-helpers";
import React from "react";
import MainWrapper from "../../../components/Main/MainWrapper";
import { EpisodeContextProvider } from "./EpisodeContext";
import { EpisodeList } from "./EpisodeList";
import { EpisodeListHeader } from "./EpisodeListHeader";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PodcastHeader } from "../../../components/Media/Podcast/PodcastHeader";
import { SideContent } from "../../../components/SideContent/SideContent";

interface EpisodeClientProps {
  initialQueryParams: QueryParamsItem;
  ssrItem: DTOItem;
}

export function EpisodeClient(props: EpisodeClientProps) {
  const { initialQueryParams, ssrItem } = props;
  console.log("ssrItem:", ssrItem.channel);
  if (!ssrItem.channel) {
    return null;
  }

  return (
    <EpisodeContextProvider
      initialQueryParams={initialQueryParams}
      ssrItem={ssrItem}
    >
      <MainWrapper>
        <PodcastHeader channel={ssrItem.channel} />
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <EpisodeListHeader />
            <EpisodeList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </EpisodeContextProvider>
  );
}
