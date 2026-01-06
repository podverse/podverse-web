"use client";

import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from "podverse-helpers";
import React from "react";
import HeaderButtons from "../Header/HeaderButtons";

type PodcastHeaderButtonsProps = {
  channel: DTOChannel;
  item?: DTOItem;
  clip?: DTOClip;
  item_chapter?: DTOItemChapter;
  item_soundbite?: DTOItemSoundbite;
};

export const PodcastHeaderButtons: React.FC<PodcastHeaderButtonsProps> = ({ channel,
  item = null, clip = null, item_chapter = null, item_soundbite = null }) => {
  return (
    <HeaderButtons
      channel={channel}
      shareArgs={{ item, clip, item_chapter, item_soundbite }}
      kind="podcast"
    />
  )
};

