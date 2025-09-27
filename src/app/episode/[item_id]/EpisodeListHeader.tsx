"use client";

import { useTranslations } from "next-intl";
import {
  QueryParamsStatsRange,
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QueryParamsItemType,
  QUERY_PARAMS_ITEM_TYPE_VALUES,
  QueryParamsItemSort,
  QUERY_PARAMS_ITEM_SORT_VALUES,
} from "podverse-helpers";
import React from "react";
import Dropdown from "../../../components/Dropdown/Dropdown";
import ListHeader from "../../../components/List/ListHeader";
import { useEpisodeContext } from "./EpisodeContext";
import { getEpisodeDropdownConfig } from "./EpisodeDropdownConfig";
import { Tabs } from "../../../components/Tabs/Tabs";

export const EpisodeListHeader: React.FC = () => {
  const { filterParams, setFilterParams, setTotalPages } = useEpisodeContext();
  const { type, sort, range } = filterParams;
  const tFilters = useTranslations('filters');
  const tInfo = useTranslations('info');
  const tFeatures = useTranslations('features');

  const { sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getEpisodeDropdownConfig({ sort, tFilters });

  function isItemType(val: string): val is QueryParamsItemType {
    return QUERY_PARAMS_ITEM_TYPE_VALUES.includes(val as QueryParamsItemType);
  }
  function isItemSort(val: string): val is QueryParamsItemSort {
    return QUERY_PARAMS_ITEM_SORT_VALUES.includes(val as QueryParamsItemSort);
  }
  function isStatsRange(val: string): val is QueryParamsStatsRange {
    return QUERY_PARAMS_STATS_RANGE_VALUES.includes(val as QueryParamsStatsRange);
  }

  const handleTypeChange = (value: string) => {
    if (isItemType(value)) {
      setFilterParams({ ...filterParams, type: value, page: 1 });
      setTotalPages(1);
    }
  };

  const handleSortChange = (value: string) => {
    if (isItemSort(value)) {
      setFilterParams({ ...filterParams, sort: value });
    }
  };

  const handleRangeChange = (value: string) => {
    if (isStatsRange(value)) {
      setFilterParams({ ...filterParams, range: value });
    }
  };

  const tabData = [
    {
      key: "summary",
      label: tInfo("summary.summary"),
      onClick: () => handleTypeChange("summary.summary"),
      zIndex: 5
    },
    {
      key: "chapters",
      label: tInfo("chapter.chapters"),
      onClick: () => handleTypeChange("chapters"),
      zIndex: 4
    },
    {
      key: "soundbites",
      label: tInfo("soundbite.official_clips"),
      onClick: () => handleTypeChange("soundbites"),
      zIndex: 3
    },
    {
      key: "clips",
      label: tFeatures("clip.clips"),
      onClick: () => handleTypeChange("clips"),
      zIndex: 2
    },
    {
      key: "transcript",
      label: tInfo("transcript"),
      onClick: () => handleTypeChange("transcript"),
      zIndex: 1
    }
  ]

  let filterDropdowns: React.ReactNode[] = [];
  if (type === "soundbites" || type === "clips") {
    filterDropdowns = [
      <Dropdown
        key="sort"
        value={sort ?? ""}
        menuItems={sortMenuItems}
        onChange={handleSortChange}
        position="right"
      />,
      showRangeDropdown && (
        <Dropdown
          key="range"
          value={range ?? ""}
          menuItems={rangeMenuItems}
          onChange={handleRangeChange}
          position="right"
        />
      )
    ]
  }

  return (
    <ListHeader
      tabs={
        <Tabs
          tabData={tabData}
          selectedKey={type ?? ""}
        />
      }
      filterDropdowns={filterDropdowns}
    />
  );
};
