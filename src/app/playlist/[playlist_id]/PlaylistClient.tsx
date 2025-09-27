
"use client";

import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PlaylistHeader } from "./PlaylistHeader";
import { DTOPlaylist } from "podverse-helpers";
import { PlaylistContextProvider } from "./PlaylistContext";

interface PlaylistClientProps {
  ssrPlaylist: DTOPlaylist
}

export function PlaylistClient({ ssrPlaylist }: PlaylistClientProps) {
  return (
    <PlaylistContextProvider ssrPlaylist={ssrPlaylist}>
      <PlaylistHeader playlist={ssrPlaylist} />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            hqwerfadsifadofuadsfsauiu
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </PlaylistContextProvider>
  );
}
