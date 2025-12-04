
"use client";

import { DTOClip, QueryParamsGetManyPartial } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { ClipsContextProvider } from "./ClipsContext";
import { ClipsHeader } from "./ClipsHeader";
import { ClipsList } from "./ClipsList";

interface ClipsClientProps {
  initialQueryParams: QueryParamsGetManyPartial;
  ssrClips: DTOClip[];
  ssrTotalPages: number;
}

export function ClipsClient(props: ClipsClientProps) {
  const { initialQueryParams, ssrClips, ssrTotalPages } = props;
  
  return (
    <ClipsContextProvider
      initialQueryParams={initialQueryParams}
      ssrClips={ssrClips}
      ssrTotalPages={ssrTotalPages}
    >
      <ClipsHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <ClipsList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </ClipsContextProvider>
  );
}
