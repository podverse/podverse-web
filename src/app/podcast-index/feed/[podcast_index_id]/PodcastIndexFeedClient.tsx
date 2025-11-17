
"use client";

import React from "react";
import { PodcastIndexFeedHeader } from "./PodcastIndexFeedHeader";
import { MainWrapper } from "../../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../../../components/SideContent/SideContent";
import { PodcastIndexFeedInfo } from "../../../../components/PodcastIndex/PodcastIndexFeedInfo";
import { PodcastByIdFeed } from "podverse-helpers";

type PodcastIndexFeedClientProps = {
  ssrFeed: PodcastByIdFeed;
};

export function PodcastIndexFeedClient({ ssrFeed }: PodcastIndexFeedClientProps) {
  return (
    <MainWrapper>
      <PodcastIndexFeedHeader />
      <MainInnerWrapper>
        <SideContent />
        <MainInnerContentWrapper>
          <PodcastIndexFeedInfo podcastIndexFeed={ssrFeed} />
        </MainInnerContentWrapper>
      </MainInnerWrapper>
    </MainWrapper>
  );
}
