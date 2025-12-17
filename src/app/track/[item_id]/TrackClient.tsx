import { DTOChannel, DTOItem, QueryParamsItemMusic } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { TrackContextProvider } from "./TrackContext";
import { TrackList } from "./TrackList";
import { TrackListHeader } from "./TrackListHeader";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../../components/SideContent/SideContent";
import { AlbumHeader } from "../../../components/Media/Music/Album/AlbumHeader";
import { TrackHeader } from "../../../components/Media/Music/Album/Track/TrackHeader";

interface TrackClientProps {
  initialQueryParams: QueryParamsItemMusic;
  ssrChannel: DTOChannel;
  ssrItem: DTOItem;
  ssrHasTranscripts: boolean;
}

export function TrackClient(props: TrackClientProps) {
  const { initialQueryParams, ssrItem, ssrChannel, ssrHasTranscripts } = props;

  return (
    <TrackContextProvider initialQueryParams={initialQueryParams}>
      <MainWrapper>
        <AlbumHeader channel={ssrChannel} item={ssrItem}  />
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <TrackHeader channel={ssrChannel} item={ssrItem}  />
            <TrackListHeader
              ssrHasTranscripts={ssrHasTranscripts}
            />
            <TrackList ssrItem={ssrItem} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </TrackContextProvider>
  );
}
