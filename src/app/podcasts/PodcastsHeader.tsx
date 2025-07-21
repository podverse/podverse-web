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
import type { MenuItem } from "../../components/FilterDropdown/FilterDropdown";

interface DropdownConfig {
  typeMenuItems: MenuItem[];
  sortMenuItems: MenuItem[];
  rangeMenuItems: MenuItem[];
  showRangeDropdown: boolean;
}

interface PodcastsHeaderProps {
  dropdownConfig: DropdownConfig;
}

const PodcastsHeader: React.FC<PodcastsHeaderProps> = ({ dropdownConfig }) => {
  const { type, setType, sort, setSort, range, setRange } = usePodcastsContext();
  const tMedia = useTranslations('media');
  const { typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown } = dropdownConfig;

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
          onChange={v => {
            if (isChannelType(v)) {
              setType(v);
            }
          }}
        />,
        <FilterDropdown
          key="sort"
          value={sort ?? ""}
          menuItems={sortMenuItems}
          onChange={v => {
            if (isChannelSort(v)) {
              setSort(v);
            }
          }}
        />,
        showRangeDropdown && (
          <FilterDropdown
            key="range"
            value={range ?? ""}
            menuItems={rangeMenuItems}
            onChange={v => {
              if (isStatsRange(v)) {
                setRange(v);
              }
            }}
          />
        )
      ].filter(Boolean)}
    />
  );
};

export default PodcastsHeader;
