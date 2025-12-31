import { DTOChannel, DTOItem, QueryParamsChannelMusic, RemoteItemsResponse } from "podverse-helpers";
import React from "react";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { AlbumContextProvider } from "./AlbumContext";
import { AlbumListHeader } from "./AlbumListHeader";
import { AlbumList } from "./AlbumList";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";
import { AlbumSideContent } from "./AlbumSideContent";
import { AlbumHeader } from "../../../components/Media/Music/Album/AlbumHeader";

interface AlbumClientProps {
  initialQueryParams: QueryParamsChannelMusic;
  ssrChannel: DTOChannel;
  ssrItemsWithLiveItem: DTOItem[];
  ssrItems: DTOItem[];
  ssrTotalPages: number;
  ssrPodroll: RemoteItemsResponse | null;
}

export function AlbumClient(props: AlbumClientProps) {
  const { initialQueryParams, ssrChannel, ssrItemsWithLiveItem, ssrItems,
    ssrTotalPages, ssrPodroll } = props;

  return (
    <AlbumContextProvider
      initialQueryParams={initialQueryParams}
      ssrItemsWithLiveItem={ssrItemsWithLiveItem}
      ssrItems={ssrItems}
      ssrTotalPages={ssrTotalPages}
    >
      <MainWrapper>
        <AlbumHeader channel={ssrChannel} />
        <MainInnerWrapper>
          <AlbumSideContent
            channel={ssrChannel}
            podroll={ssrPodroll}
          />
          <MainInnerContentWrapper>
            <AlbumListHeader ssrHasPodroll={!!ssrPodroll} />
            <AlbumList
              ssrChannel={ssrChannel}
              podroll={ssrPodroll} />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </AlbumContextProvider>
  );
}
