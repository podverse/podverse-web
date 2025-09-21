
"use client";

import { DTOChannel, QueryParamsChannels } from "podverse-helpers";
import React from "react";
import { PodcastsContextProvider } from "./PodcastsContext";
import MainWrapper from "../../components/Main/MainWrapper";
import { PodcastsHeader } from "./PodcastsHeader";
import { PodcastsList } from "./PodcastsList";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";

interface PodcastsClientProps {
  initialQueryParams: QueryParamsChannels;
  ssrChannels: DTOChannel[];
  ssrTotalPages: number;
}

export function PodcastsClient(props: PodcastsClientProps) {
  const { initialQueryParams, ssrChannels, ssrTotalPages } = props;
  
  return (
    <PodcastsContextProvider
      initialQueryParams={initialQueryParams}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    >
      <PodcastsHeader />
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
