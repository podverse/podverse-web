
"use client";

import { DTOPlaylist } from "podverse-helpers";
import React from "react";
import { PlaylistEditContextProvider } from "./PlaylistEditContext";
import { PlaylistEditForm } from "./PlaylistEditForm";
import { PlaylistEditHeader } from "./PlaylistEditHeader";
import { MainWrapper } from "../../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../../components/Main/MainInnerContentWrapper";
import { PlaylistEditButtonTabs } from "./PlaylistEditButtonTabs";
import { PlaylistEditList } from "./PlaylistEditList";
import { SideContent } from "../../../../components/SideContent/SideContent";

type PlaylistEditClientProps = {
  ssrPlaylist: DTOPlaylist;
}

export function PlaylistEditClient({ ssrPlaylist }: PlaylistEditClientProps) {
  return (
    <PlaylistEditContextProvider ssrPlaylist={ssrPlaylist}>
      <PlaylistEditHeader />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <PlaylistEditButtonTabs />
            <PlaylistEditForm ssrPlaylist={ssrPlaylist} />
            <PlaylistEditList ssrPlaylist={ssrPlaylist} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </PlaylistEditContextProvider>
  );
}
