"use client";

import { useTranslations } from "next-intl";
import {
  QueryParamsStatsRange,
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QueryParamsChannelType,
  QUERY_PARAMS_CHANNEL_TYPE_VALUES,
  QueryParamsChannelSort,
  QUERY_PARAMS_CHANNEL_SORT_VALUES,
} from "podverse-helpers";
import React from "react";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { ListHeader } from "../../../components/List/ListHeader";
import { usePodcastContext } from "./PodcastContext";
import { getPodcastDropdownConfig } from "./PodcastDropdownConfig";
import { Tabs } from "../../../components/Tabs/Tabs";
import { useAccount } from "../../../contexts/Account";

type PodcastListHeaderProps = {
  ssrHasItemSoundbites?: boolean;
};

export const PodcastListHeader: React.FC<PodcastListHeaderProps> = ({ ssrHasItemSoundbites }) => {
  const { filterParams, setFilterParams } = usePodcastContext();
  const { type, sort, range } = filterParams;
  const tFilters = useTranslations('filters');
  const tMedia = useTranslations('media');
  const tInfo = useTranslations('info');
  const tFeatures = useTranslations('features');
  const tSettings = useTranslations('settings');
  const { loggedInAccount } = useAccount();

  const { sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getPodcastDropdownConfig({ sort, tFilters, tMedia });

  function isChannelType(val: string): val is QueryParamsChannelType {
    return QUERY_PARAMS_CHANNEL_TYPE_VALUES.includes(val as QueryParamsChannelType);
  }
  function isChannelSort(val: string): val is QueryParamsChannelSort {
    return QUERY_PARAMS_CHANNEL_SORT_VALUES.includes(val as QueryParamsChannelSort);
  }
  function isStatsRange(val: string): val is QueryParamsStatsRange {
    return QUERY_PARAMS_STATS_RANGE_VALUES.includes(val as QueryParamsStatsRange);
  }

  const handleTypeChange = (value: string) => {
    if (isChannelType(value)) {
      setFilterParams({ ...filterParams, type: value, page: 1 });
    }
  };

  const handleSortChange = (value: string) => {
    if (isChannelSort(value)) {
      if (value === "top") {
        setFilterParams({ ...filterParams, sort: value, range: "week", page: 1 });
      } else {
        setFilterParams({ ...filterParams, sort: value, page: 1 });
      }
    }
  };

  const handleRangeChange = (value: string) => {
    if (isStatsRange(value)) {
      setFilterParams({ ...filterParams, range: value, page: 1 });
    }
  };

  const tabData = [{
    key: "episodes",
    label: tMedia("podcast.episodes"),
    onClick: () => handleTypeChange("episodes"),
    hideDesktop: false,
    zIndex: 6
  }];

  if (ssrHasItemSoundbites) {
    tabData.push({
      key: "soundbites",
      label: tInfo("soundbite.official_clips"),
      onClick: () => handleTypeChange("soundbites"),
      hideDesktop: false,
      zIndex: 5
    })
  }

  tabData.push(
    {
      key: "clips",
      label: tFeatures("clip.clips"),
      onClick: () => handleTypeChange("clips"),
      hideDesktop: false,
      zIndex: 4
    }
  )

  tabData.push({
    key: "about",
    label: tInfo("about"),
    onClick: () => handleTypeChange("about"),
    hideDesktop: true,
    zIndex: 3
  })

  tabData.push({
    key: "podroll",
    label: tInfo("podroll"),
    onClick: () => handleTypeChange("podroll"),
    hideDesktop: true,
    zIndex: 2
  })

  if (loggedInAccount) {
    tabData.push({
      key: "settings",
      label: tSettings("settings"),
      onClick: () => handleTypeChange("settings"),
      hideDesktop: false,
      zIndex: 1
    })
  }

  let sideButtons: React.ReactNode = null;
  if (type === "episodes" || type === "clips") {
    sideButtons = (
      <>
        <Dropdown
          key="sort"
          value={sort ?? ""}
          menuItems={sortMenuItems}
          onChange={handleSortChange}
          position="right"
        />
        {
          showRangeDropdown && (
            <Dropdown
              key="range"
              value={range ?? ""}
              menuItems={rangeMenuItems}
              onChange={handleRangeChange}
              position="right"
            />
          )
        }
      </>
    )
  }

  return (
    <ListHeader
      tabs={
        <Tabs
          tabData={tabData}
          selectedKey={type ?? ""}
        />
      }
      sideButtons={sideButtons}
    />
  );
};
