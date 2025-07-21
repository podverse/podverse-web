
"use client";

import React from "react";
import { PodcastsContextProvider } from "./PodcastsContext";
import MainWrapper from "../../components/MainWrapper/MainWrapper";
import { DTOChannel, QueryParamChannels } from "podverse-helpers";
import type { MenuItem } from "../../components/FilterDropdown/FilterDropdown";
import PodcastsHeader from "./PodcastsHeader";
import PodcastsList from "./PodcastsList";

interface DropdownConfig {
  typeMenuItems: MenuItem[];
  sortMenuItems: MenuItem[];
  rangeMenuItems: MenuItem[];
  showRangeDropdown: boolean;
}

interface PodcastsClientProps {
  initialQueryParams: QueryParamChannels;
  ssrChannels: DTOChannel[];
  ssrTotalPages: number;
  dropdownConfig: DropdownConfig;
}

export default function PodcastsClient(props: PodcastsClientProps) {
  const { initialQueryParams, ssrChannels, ssrTotalPages, dropdownConfig } = props;
  
  return (
    <PodcastsContextProvider
      initialQueryParams={initialQueryParams}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    >
      <PodcastsHeader dropdownConfig={dropdownConfig} />
      <MainWrapper>
        <PodcastsList />
      </MainWrapper>
    </PodcastsContextProvider>
  );
}
