
"use client";

import { DTOChannel, QueryParamsGetManyMusic } from "podverse-helpers";
import React from "react";
import { AlbumsContextProvider } from "./AlbumsContext";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { AlbumsHeader } from "./AlbumsHeader";
import { AlbumsList } from "./AlbumsList";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";

interface AlbumsClientProps {
  initialQueryParams: QueryParamsGetManyMusic;
  ssrChannels: DTOChannel[];
  ssrTotalPages: number;
}

export function AlbumsClient(props: AlbumsClientProps) {
  const { initialQueryParams, ssrChannels, ssrTotalPages } = props;
  
  return (
    <AlbumsContextProvider
      initialQueryParams={initialQueryParams}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    >
      <AlbumsHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <AlbumsList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </AlbumsContextProvider>
  );
}
