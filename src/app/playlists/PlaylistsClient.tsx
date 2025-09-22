
"use client";

import { DTOPlaylist, QueryParamsPlaylists } from "podverse-helpers";
import React from "react";
import { PlaylistsContextProvider } from "./PlaylistsContext";
import MainWrapper from "../../components/Main/MainWrapper";
import { PlaylistsHeader } from "./PlaylistsHeader";
import { PlaylistsList } from "./PlaylistsList";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { PlaylistsListHeader } from "./PlaylistsListHeader";

interface PlaylistsClientProps {
  initialQueryParams: QueryParamsPlaylists;
  ssrPlaylists: DTOPlaylist[];
  ssrTotalPages: number;
}

export function PlaylistsClient(props: PlaylistsClientProps) {
  const { initialQueryParams, ssrPlaylists, ssrTotalPages } = props;

  return (
    <PlaylistsContextProvider
      initialQueryParams={initialQueryParams}
      ssrPlaylists={ssrPlaylists}
      ssrTotalPages={ssrTotalPages}
    >
      <PlaylistsHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <PlaylistsListHeader />
            <PlaylistsList />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </PlaylistsContextProvider>
  );
}
