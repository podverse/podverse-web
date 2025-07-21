"use client";

import { useTranslations } from "next-intl";
import {
  QUERY_PARAMS_CHANNELS_TYPE_VALUES,
  QUERY_PARAMS_CHANNELS_SORT_VALUES,
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QueryParamsChannelsType,
  QueryParamsChannelsSort,
  QueryParamsStatsRange,
} from "podverse-helpers";
import React from "react";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import Header from "../../components/Header/Header";
import { usePodcastsContext } from "./PodcastsContext";
import { getDropdownConfig } from "./PodcastsDropdownConfig";

const PodcastsHeader: React.FC = () => {
  const { queryParams, setQueryParams } = usePodcastsContext();
  const { type, sort, range } = queryParams;
  const tMedia = useTranslations('media');
  const tFilters = useTranslations('filters');
  const { typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getDropdownConfig({ type, sort, tFilters });

  function isChannelType(val: string): val is QueryParamsChannelsType {
    return QUERY_PARAMS_CHANNELS_TYPE_VALUES.includes(val as QueryParamsChannelsType);
  }
  function isChannelSort(val: string): val is QueryParamsChannelsSort {
    return QUERY_PARAMS_CHANNELS_SORT_VALUES.includes(val as QueryParamsChannelsSort);
  }
  function isStatsRange(val: string): val is QueryParamsStatsRange {
    return QUERY_PARAMS_STATS_RANGE_VALUES.includes(val as QueryParamsStatsRange);
  }

  return (
    <Header
      title={tMedia("podcast.podcasts")}
      filterDropdowns={[
        <FilterDropdown
          key="type"
          value={type ?? ""}
          menuItems={typeMenuItems}
          onChange={value => {
            if (isChannelType(value)) {
              if (value === "all" || value === "category") {
                setQueryParams({ ...queryParams, type: value, sort: "top" });
              } else {
                setQueryParams({ ...queryParams, type: value, sort: "alphabetical" });
              }
            }
          }}
        />,
        <FilterDropdown
          key="sort"
          value={sort ?? ""}
          menuItems={sortMenuItems}
          onChange={value => {
            if (isChannelSort(value)) {
              setQueryParams({ ...queryParams, sort: value });
            }
          }}
        />,
        showRangeDropdown && (
          <FilterDropdown
            key="range"
            value={range ?? ""}
            menuItems={rangeMenuItems}
            onChange={value => {
              if (isStatsRange(value)) {
                setQueryParams({ ...queryParams, range: value });
              }
            }}
          />
        )
      ].filter(Boolean)}
    />
  );
};

export default PodcastsHeader;
