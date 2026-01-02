"use client";

import { DTOItem, EpisodeByGuidResponse } from "podverse-helpers";
import React from "react";
import { ViewSelectedOption } from "../../../../ViewSelector/ViewSelector";
import { ListTrackRemoteItemNodes } from "./ListTrackRemoteItemNodes";

type Props = {
  itemsAdded: DTOItem[];
  itemsUnadded: NonNullable<EpisodeByGuidResponse['episode']>[];
  viewSelected: ViewSelectedOption;
};

export const ListTracksRemoteItems: React.FC<Props> = ({
  itemsAdded,
  itemsUnadded,
  viewSelected
}) => {
  const listNodes = ListTrackRemoteItemNodes({ itemsAdded, itemsUnadded, viewSelected });
  return listNodes;
};
