"use client";

import { useTranslations } from "next-intl";
import {
  QUERY_PARAMS_CHANNEL_MUSIC_ARTIST_TYPE_VALUES,
  QueryParamsChannelMusicArtistType
} from "podverse-helpers";
import React from "react";
import { ListHeader } from "../../../components/List/ListHeader";
import { useArtistContext } from "./ArtistContext";
import { Tabs } from "../../../components/Tabs/Tabs";
import { useAccount } from "../../../contexts/Account";

type ArtistListHeaderProps = {
  ssrHasPodroll: boolean;
  ssrHasAlbums: boolean;
  ssrHasTracks: boolean;
  ssrHasDescription: boolean;
};

export const ArtistListHeader: React.FC<ArtistListHeaderProps> = ({
  ssrHasPodroll, ssrHasAlbums, ssrHasTracks, ssrHasDescription } ) => {
  const { filterParams, setFilterParams } = useArtistContext();
  const { type } = filterParams;
  const tMedia = useTranslations('media');
  const tInfo = useTranslations('info');
  const tSettings = useTranslations('settings');
  const { loggedInAccount } = useAccount();

  function isChannelType(val: string): val is QueryParamsChannelMusicArtistType {
    return QUERY_PARAMS_CHANNEL_MUSIC_ARTIST_TYPE_VALUES.includes(val as QueryParamsChannelMusicArtistType);
  }

  const handleTypeChange = (value: string) => {
    if (isChannelType(value)) {
      setFilterParams({ ...filterParams, type: value });
    }
  };
  
  const tabData = [];

  if (ssrHasAlbums) {
    tabData.push({
      key: "albums",
      label: tMedia("music.albums"),
      onClick: () => handleTypeChange("albums"),
      hideDesktop: false,
      zIndex: 7
    });
  }

  if (ssrHasTracks) {
    tabData.push({
      key: "tracks",
      label: tMedia("music.tracks"),
      onClick: () => handleTypeChange("tracks"),
      hideDesktop: false,
      zIndex: 6
    });
  }

  if (ssrHasDescription) {
    tabData.push({
      key: "about",
      label: tInfo("about"),
      onClick: () => handleTypeChange("about"),
      hideDesktop: true,
      zIndex: 3
    })
  }

  if (ssrHasPodroll) {
    tabData.push({
      key: "podroll",
      label: tInfo("podroll"),
      onClick: () => handleTypeChange("podroll"),
      hideDesktop: true,
      zIndex: 2
    })
  }

  if (loggedInAccount) {
    tabData.push({
      key: "settings",
      label: tSettings("settings"),
      onClick: () => handleTypeChange("settings"),
      hideDesktop: false,
      zIndex: 1
    })
  }

  return (
    <ListHeader
      tabs={
        <Tabs
          tabData={tabData}
          selectedKey={type ?? ""}
        />
      }
    />
  );
};
