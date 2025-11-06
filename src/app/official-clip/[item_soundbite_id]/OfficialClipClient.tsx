import { DTOChannel, DTOClip, DTOItem, DTOItemSoundbite } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { PodcastHeader } from "../../../components/Media/Podcast/PodcastHeader";
import { SideContent } from "../../../components/SideContent/SideContent";
import { ItemSoundbiteHeader } from "../../../components/Media/ItemSoundbite/ItemSoundbiteHeader";

interface OfficialClipClientProps {
  ssrChannel: DTOChannel;
  ssrItem: DTOItem;
  ssrItemSoundbite: DTOItemSoundbite;
}

export function OfficialClipClient(props: OfficialClipClientProps) {
  const { ssrChannel, ssrItem, ssrItemSoundbite } = props;

  return (
    <MainWrapper>
      <PodcastHeader channel={ssrChannel} item={ssrItem} item_soundbite={ssrItemSoundbite} />
      <MainInnerWrapper>
        <SideContent />
        <MainInnerContentWrapper>
          <ItemSoundbiteHeader channel={ssrChannel} item={ssrItem} item_soundbite={ssrItemSoundbite} />
        </MainInnerContentWrapper>
      </MainInnerWrapper>
    </MainWrapper>
  );
}
