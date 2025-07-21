
"use client";

import React from "react";
import { PodcastsContextProvider } from "./PodcastsContext";
import MainWrapper from "../../components/MainWrapper/MainWrapper";
import PodcastList from "../../components/Podcast/PodcastList";
import { DTOChannel, QueryParamChannels } from "podverse-helpers";
import type { MenuItem } from "../../components/FilterDropdown/FilterDropdown";
import PodcastsHeader from "./PodcastsHeader";
import { useLoadingSpinnerGlobal } from "../../contexts/LoadingGlobal";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";

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
  const { isLoadingGlobal } = useLoadingSpinnerGlobal();
  
  return (
    <PodcastsContextProvider
      initialQueryParams={initialQueryParams}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    >
      {isLoadingGlobal && <LoadingSpinnerOverlay />}
      <PodcastsHeader dropdownConfig={dropdownConfig} />
      <MainWrapper>
        <PodcastList />
      </MainWrapper>
    </PodcastsContextProvider>
  );
}
