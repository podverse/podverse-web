"use client";

import { DTOChannel, DTOItem } from "podverse-helpers";
import React from "react";
import HeaderButtons from "../../Header/HeaderButtons";

type AlbumHeaderButtonsProps = {
  channel: DTOChannel;
  item?: DTOItem;
};

export const AlbumHeaderButtons: React.FC<AlbumHeaderButtonsProps> = ({ channel, item = null }) => {
  return (
    <HeaderButtons
      channel={channel}
      shareArgs={{ item, clip: null, item_chapter: null, item_soundbite: null }}
      kind="album"
    />
  )
};
