"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ListHeader } from "../../components/List/ListHeader";
import { Tabs } from "../../components/Tabs/Tabs";
import Dropdown from "../../components/Dropdown/Dropdown";
import { useMyProfileContentContext, MyProfileContentTab } from "./MyProfileContentContext";
import styles from "../../styles/app/profile/ProfileContentListHeader.module.scss";

export const MyProfileContentListHeader: React.FC = () => {
  const { selectedTab, setSelectedTab } = useMyProfileContentContext();
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");
  const tFilters = useTranslations("filters");

  const tabData = [
    {
      key: "podcasts",
      label: tMedia("podcast.podcasts"),
      onClick: () => setSelectedTab("podcasts" as MyProfileContentTab),
      zIndex: 4
    },
    {
      key: "albums",
      label: tMedia("music.albums"),
      onClick: () => setSelectedTab("albums" as MyProfileContentTab),
      zIndex: 3
    },
    {
      key: "playlists",
      label: tFeatures("playlist.playlists"),
      onClick: () => setSelectedTab("playlists" as MyProfileContentTab),
      zIndex: 2
    },
    {
      key: "clips",
      label: tFeatures("clip.clips"),
      onClick: () => setSelectedTab("clips" as MyProfileContentTab),
      zIndex: 1
    }
  ];

  // Get the sort label based on current tab
  const getSortLabel = () => {
    if (selectedTab === "podcasts" || selectedTab === "albums" || selectedTab === "playlists") {
      return tFilters("sort.a_z");
    }
    return tFilters("sort.recent");
  };

  // Single item dropdown (informational only)
  const sortMenuItems = [{
    label: getSortLabel(),
    param: "sort",
    value: selectedTab === "clips" ? "recent" : "a_z"
  }];

  const sideButtons = (
    <Dropdown
      key="sort"
      value={selectedTab === "clips" ? "recent" : "a_z"}
      menuItems={sortMenuItems}
      onChange={() => {}} // No-op since sort is fixed
      position="right"
    />
  );

  return (
    <div className={styles.listHeaderWrapper}>
      <ListHeader
        tabs={
          <Tabs
            tabData={tabData}
            selectedKey={selectedTab}
          />
        }
        sideButtons={sideButtons}
      />
    </div>
  );
};
