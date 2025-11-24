"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  QUERY_PARAMS_CHANNELS_TYPE_VALUES,
  QUERY_PARAMS_CHANNELS_SORT_VALUES,
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QueryParamsChannelsType,
  QueryParamsChannelsSort,
  QueryParamsStatsRange,
} from "podverse-helpers";
import React from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import { MainHeader } from "../../components/Main/MainHeader";
import { usePodcastsContext } from "./PodcastsContext";
import { getPodcastsDropdownConfig } from "./PodcastsDropdownConfig";
import { ViewSelector } from "../../components/ViewSelector/ViewSelector";
import { useLocalSettings } from "../../contexts/LocalSettings";

export const PodcastsHeader: React.FC = () => {
  const { filterParams, setFilterParams } = usePodcastsContext();
  const { viewSelected, setViewSelected } = useLocalSettings();
  const { type, sort, range, category } = filterParams;
  const tMedia = useTranslations('media');
  const tFilters = useTranslations('filters');
  const { typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getPodcastsDropdownConfig({ type, sort, category, tFilters });

  const router = useRouter();

  function isChannelType(val: string): val is QueryParamsChannelsType {
    return QUERY_PARAMS_CHANNELS_TYPE_VALUES.includes(val as QueryParamsChannelsType);
  }
  function isChannelSort(val: string): val is QueryParamsChannelsSort {
    return QUERY_PARAMS_CHANNELS_SORT_VALUES.includes(val as QueryParamsChannelsSort);
  }
  function isStatsRange(val: string): val is QueryParamsStatsRange {
    return QUERY_PARAMS_STATS_RANGE_VALUES.includes(val as QueryParamsStatsRange);
  }

  const handleTypeChange = (value: string) => {
    if (isChannelType(value)) {
      if (value === "global") {
        setFilterParams({ ...filterParams, type: value, sort: "recent", page: 1, category: undefined });
      } else if (value === "category") {
        router.push("/podcasts/categories");
      } else {
        setFilterParams({ ...filterParams, type: value, sort: "recent", page: 1, category: undefined });
      }
    }
  };

  const handleSortChange = (value: string) => {
    if (isChannelSort(value)) {
      setFilterParams({ ...filterParams, sort: value });
    }
  };

  const handleRangeChange = (value: string) => {
    if (isStatsRange(value)) {
      setFilterParams({ ...filterParams, range: value });
    }
  };

  const buttonsNode = (
    <>
      <Dropdown
        key="type"
        value={type ?? ""}
        menuItems={typeMenuItems}
        onChange={handleTypeChange}
      />
      <Dropdown
        key="sort"
        value={sort ?? ""}
        menuItems={sortMenuItems}
        onChange={handleSortChange}
      />
      {showRangeDropdown && (
        <Dropdown
          key="range"
          value={range ?? ""}
          menuItems={rangeMenuItems}
          onChange={handleRangeChange}
        />
      )}
      <ViewSelector
        viewSelected={viewSelected}
        setViewSelected={setViewSelected}
      />
    </>
  );

  return (
    <MainHeader
      title={tMedia("podcast.podcasts")}
      buttonsNode={buttonsNode}
    />
  );
};
