"use client";

import { DTOChannel, PodcastBatchByFeedGuidResponse } from "podverse-helpers";
import React from "react";
import { ViewSelectedOption } from "../../../ViewSelector/ViewSelector";
import { ListAlbumRemoteItemNodes } from "./ListAlbumRemoteItemNodes";

type Props = {
  channelsAdded: DTOChannel[];
  channelsUnadded: PodcastBatchByFeedGuidResponse['feeds'];
  viewSelected: ViewSelectedOption;
};

export const ListAlbumsRemoteItems: React.FC<Props> = ({ channelsAdded, channelsUnadded, viewSelected }) => {
  const listNodes = ListAlbumRemoteItemNodes({ channelsAdded, channelsUnadded, viewSelected });
  return listNodes;
};
