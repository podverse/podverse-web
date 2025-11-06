import { DTOChannel, DTOClip, DTOItem } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PodcastHeader } from "../../../components/Media/Podcast/PodcastHeader";
import { SideContent } from "../../../components/SideContent/SideContent";
import { ClipHeader } from "../../../components/Media/Clip/ClipHeader";

interface ClipClientProps {
  ssrChannel: DTOChannel;
  ssrClip: DTOClip;
  ssrItem: DTOItem;
}

export function ClipClient(props: ClipClientProps) {
  const { ssrChannel, ssrClip, ssrItem } = props;

  return (
    <MainWrapper>
      <PodcastHeader channel={ssrChannel} item={ssrItem} clip={ssrClip} />
      <MainInnerWrapper>
        <SideContent />
        <MainInnerContentWrapper>
          <ClipHeader channel={ssrChannel} item={ssrItem} clip={ssrClip} />
        </MainInnerContentWrapper>
      </MainInnerWrapper>
    </MainWrapper>
  );
}
