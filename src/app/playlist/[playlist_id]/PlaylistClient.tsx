
"use client";

import { DTOPlaylist } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistContextProvider } from "./PlaylistContext";
import { PlaylistList } from "./PlaylistList";
import { SideContent } from "../../../components/SideContent/SideContent";

interface PlaylistClientProps {
  ssrPlaylist: DTOPlaylist
}

export function PlaylistClient({ ssrPlaylist }: PlaylistClientProps) {
  return (
    <PlaylistContextProvider ssrPlaylist={ssrPlaylist}>
      <PlaylistHeader playlist={ssrPlaylist} />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <PlaylistList ssrPlaylist={ssrPlaylist} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </PlaylistContextProvider>
  );
}
