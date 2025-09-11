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
import MainHeader from "../../components/Main/MainHeader";
import { usePodcastsContext } from "./PodcastsContext";
import { getPodcastsDropdownConfig } from "./PodcastsDropdownConfig";
import { useRouter } from "next/navigation";

const PodcastsMainHeader: React.FC = () => {
  const { queryParams, setQueryParams } = usePodcastsContext();
  const { type, sort, range, category } = queryParams;
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

  return (
    <MainHeader
      title={tMedia("podcast.podcasts")}
      filterDropdowns={[
        <FilterDropdown
          key="type"
          value={type ?? ""}
          menuItems={typeMenuItems}
          onChange={value => {
            if (isChannelType(value)) {
              if (value === "all") {
                setQueryParams({ ...queryParams, type: value, sort: "top", page: 1, category: undefined });
              } else if (value === "category") {
                router.push("/podcasts/categories");
              } else {
                setQueryParams({ ...queryParams, type: value, sort: "alphabetical", page: 1, category: undefined });
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

export default PodcastsMainHeader;
