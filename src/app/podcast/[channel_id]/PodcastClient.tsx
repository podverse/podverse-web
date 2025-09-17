import { DTOChannel, DTOClip, DTOItem, DTOLiveItem, QueryParamsChannel } from "podverse-helpers";
import React from "react";
import MainWrapper from "../../../components/Main/MainWrapper";
import { SideContent } from "../../../components/SideContent/SideContent";
import { PodcastContextProvider } from "./PodcastContext";
import PodcastListHeader from "./PodcastListHeader";
import PodcastHeader from "./PodcastHeader";
import { PodcastModalShare } from "./PodcastModalShare";
import { PodcastModalFunding } from "./PodcastModalFunding";
import { PodcastModalBoost } from "./PodcastModalBoost";
import PodcastList from "./PodcastList";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PodcastSideContent } from "./PodcastSideContent";

interface PodcastClientProps {
  initialQueryParams: QueryParamsChannel;
  ssrChannel: DTOChannel;
  ssrLiveItems: DTOLiveItem[];
  ssrItems: DTOItem[];
  ssrClips: DTOClip[];
  ssrTotalPages: number;
}

export default function PodcastClient(props: PodcastClientProps) {
  const { initialQueryParams, ssrChannel, ssrLiveItems, ssrItems, ssrClips, ssrTotalPages } = props;

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
          <MainInnerContentWrapper>
            <PodcastListHeader />
            <PodcastList />
          </MainInnerContentWrapper>
          <PodcastSideContent channel={ssrChannel} />
        </MainInnerWrapper>
      </MainWrapper>
      <PodcastModalShare channel={ssrChannel} />
      <PodcastModalFunding channel={ssrChannel} />
      <PodcastModalBoost channel={ssrChannel} />
    </PodcastContextProvider>
  );
}
