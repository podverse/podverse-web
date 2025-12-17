
"use client";

import { DTOItem, QueryParamsGetManyPartialMusic } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { TracksContextProvider } from "./TracksContext";
import { TracksHeader } from "./TracksHeader";
import { TracksList } from "./TracksList";

interface TracksClientProps {
  initialQueryParams: QueryParamsGetManyPartialMusic;
  ssrItems: DTOItem[];
  ssrTotalPages: number;
}

export function TracksClient(props: TracksClientProps) {
  const { initialQueryParams, ssrItems, ssrTotalPages } = props;
  
  return (
    <TracksContextProvider
      initialQueryParams={initialQueryParams}
      ssrItems={ssrItems}
      ssrTotalPages={ssrTotalPages}
    >
      <TracksHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <TracksList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </TracksContextProvider>
  );
}
