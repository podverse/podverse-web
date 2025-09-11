
"use client";

import { DTOChannel, DTOClip, DTOItem, DTOLiveItem, QueryParamsChannel } from "podverse-helpers";
import React from "react";
import MainWrapper from "../../../components/Main/MainWrapper";
import { PodcastContextProvider } from "./PodcastContext";
import PodcastListHeader from "./PodcastListHeader";
import HeaderPodcast from "../../../components/Header/HeaderPodcast";
// import PodcastList from "./PodcastList";

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
      <HeaderPodcast channel={ssrChannel} />
      <MainWrapper>
        <PodcastListHeader />
        <div>hello</div>
        {/* <PodcastList /> */}
      </MainWrapper>
    </PodcastContextProvider>
  );
}
