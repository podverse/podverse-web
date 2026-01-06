"use client";

import { DTOChannel } from "podverse-helpers";
import React from "react";
import HeaderButtons from "../../Header/HeaderButtons";

type ArtistHeaderButtonsProps = {
  channel: DTOChannel;
};

export const ArtistHeaderButtons: React.FC<ArtistHeaderButtonsProps> = ({ channel }) => {
  return (
    <HeaderButtons
      channel={channel}
      shareArgs={{ item: null, clip: null, item_chapter: null, item_soundbite: null }}
      kind="artist"
    />
  )
};
