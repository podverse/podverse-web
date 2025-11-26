
"use client";

import { DTOItem, QueryParamsGetManyPartial } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { EpisodesContextProvider } from "./EpisodesContext";
import { EpisodesHeader } from "./EpisodesHeader";
import { EpisodesList } from "./EpisodesList";

interface EpisodesClientProps {
  initialQueryParams: QueryParamsGetManyPartial;
  ssrItems: DTOItem[];
  ssrTotalPages: number;
}

export function EpisodesClient(props: EpisodesClientProps) {
  const { initialQueryParams, ssrItems, ssrTotalPages } = props;
  
  return (
    <EpisodesContextProvider
      initialQueryParams={initialQueryParams}
      ssrItems={ssrItems}
      ssrTotalPages={ssrTotalPages}
    >
      <EpisodesHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <EpisodesList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </EpisodesContextProvider>
  );
}
