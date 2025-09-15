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
import ListHeader from "../../../components/List/ListHeader";
import { usePodcastContext } from "./PodcastContext";
import { getPodcastDropdownConfig } from "./PodcastDropdownConfig";

const PodcastListHeader: React.FC = () => {
  const { filterParams, setFilterParams } = usePodcastContext();
  const { type, sort, range } = filterParams;
  const tFilters = useTranslations('filters');
  const tMedia = useTranslations('media');
  const { typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getPodcastDropdownConfig({ type, sort, tFilters, tMedia });

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
      if (value === "clips") {
        setFilterParams({ ...filterParams, type: value, sort: "top", page: 1 });
      } else {
        setFilterParams({ ...filterParams, type: value, sort: "recent", page: 1 });
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

  return (
    <ListHeader
      title={type === "clips" ? tMedia("clips") : tMedia("podcast.episodes")}
      filterDropdowns={[
        <Dropdown
          key="type"
          value={type ?? ""}
          menuItems={typeMenuItems}
          onChange={handleTypeChange}
          position="left"
        />,
        <Dropdown
          key="sort"
          value={sort ?? ""}
          menuItems={sortMenuItems}
          onChange={handleSortChange}
          position="left"
        />,
        showRangeDropdown && (
          <Dropdown
            key="range"
            value={range ?? ""}
            menuItems={rangeMenuItems}
            onChange={handleRangeChange}
            position="left"
          />
        )
      ].filter(Boolean)}
    />
  );
};

export default PodcastListHeader;
