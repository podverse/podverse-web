
"use client";

import { DTOChannel, QueryParamsChannels } from "podverse-helpers";
import React from "react";
import { PodcastsContextProvider } from "./PodcastsContext";
import MainWrapper from "../../components/Main/MainWrapper";
import PodcastsMainHeader from "./PodcastsMainHeader";
import PodcastsList from "./PodcastsList";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";

interface PodcastsClientProps {
  initialQueryParams: QueryParamsChannels;
  ssrChannels: DTOChannel[];
  ssrTotalPages: number;
}

export default function PodcastsClient(props: PodcastsClientProps) {
  const { initialQueryParams, ssrChannels, ssrTotalPages } = props;
  
  return (
    <PodcastsContextProvider
      initialQueryParams={initialQueryParams}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    >
      <PodcastsMainHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <PodcastsList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </PodcastsContextProvider>
  );
}
