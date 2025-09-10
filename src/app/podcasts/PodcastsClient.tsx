
"use client";

import { DTOChannel, QueryParamsChannels } from "podverse-helpers";
import React from "react";
import { PodcastsContextProvider } from "./PodcastsContext";
import MainWrapper from "../../components/MainWrapper/MainWrapper";
import PodcastsHeader from "./PodcastsHeader";
import PodcastsList from "./PodcastsList";

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
      <PodcastsHeader />
      <MainWrapper>
        <PodcastsList />
      </MainWrapper>
    </PodcastsContextProvider>
  );
}
