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
import FilterDropdown from "../../../components/FilterDropdown/FilterDropdown";
import SubHeader from "../../../components/List/ListHeader";
import { usePodcastContext } from "./PodcastContext";
import { getPodcastDropdownConfig } from "./PodcastDropdownConfig";

const PodcastListHeader: React.FC = () => {
  const { queryParams, setQueryParams } = usePodcastContext();
  const { type, sort, range } = queryParams;
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

  return (
    <SubHeader
      title={type === "clips" ? tMedia("clips") : tMedia("podcast.episodes")}
      filterDropdowns={[
        <FilterDropdown
          key="type"
          value={type ?? ""}
          menuItems={typeMenuItems}
          onChange={value => {
            if (isChannelType(value)) {
              if (value === "clips") {
                setQueryParams({ ...queryParams, type: value, sort: "top", page: 1 });
              } else {
                setQueryParams({ ...queryParams, type: value, sort: "recent", page: 1 });
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

export default PodcastListHeader;
