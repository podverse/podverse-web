"use client";

import { useTranslations } from "next-intl";
import {
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  QUERY_PARAMS_SUBSCRIBED_TYPE,
  QueryParamsStatsRange,
  QueryParamsSubscribedFullSort,
  QueryParamsSubscribedType,
} from "podverse-helpers";
import React from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import { MainHeader } from "../../components/Main/MainHeader";
import { usePodcastsContext } from "./PodcastsContext";
import { getPodcastsDropdownConfig } from "./PodcastsDropdownConfig";
import { ViewSelector } from "../../components/ViewSelector/ViewSelector";
import { useLocalSettings } from "../../contexts/LocalSettings";

export const PodcastsHeader: React.FC = () => {
  const { filterParams, setFilterParams, setShowCategoriesModal } = usePodcastsContext();
  const { viewSelected, setViewSelected } = useLocalSettings();
  const { type, sort, range, category } = filterParams;
  const tMedia = useTranslations('media');
  const tFilters = useTranslations('filters');
  const tCategories = useTranslations('categories');
  const { typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getPodcastsDropdownConfig({ type, sort, category, tFilters });

  function isChannelType(val: string): val is QueryParamsSubscribedType {
    return QUERY_PARAMS_SUBSCRIBED_TYPE.includes(val as QueryParamsSubscribedType);
  }
  function isChannelSort(val: string): val is QueryParamsSubscribedFullSort {
    return QUERY_PARAMS_SUBSCRIBED_FULL_SORT.includes(val as QueryParamsSubscribedFullSort);
  }
  function isStatsRange(val: string): val is QueryParamsStatsRange {
    return QUERY_PARAMS_STATS_RANGE_VALUES.includes(val as QueryParamsStatsRange);
  }

  const handleTypeChange = (value: string) => {
    if (isChannelType(value)) {
      if (value === "global") {
        setFilterParams({
          page: 1,
          medium: "podcasts",
          type: value,
          sort: "recent",
          range: null,
          category: null
        });
      } else if (value === "category") {
        setShowCategoriesModal(true);
      } else if (value === "subscribed") {
        setFilterParams({
          page: 1,
          medium: "podcasts",
          type: value,
          sort: "a_z",
          range: null,
          category: null
        });
      }
    }
  };

  const handleSortChange = (value: string) => {
    if (isChannelSort(value)) {
      setFilterParams({
        page: 1,
        medium: "podcasts",
        type: filterParams.type,
        sort: value,
        range: filterParams.range,
        category: filterParams.category
      });
    }
  };

  const handleRangeChange = (value: string) => {
    if (isStatsRange(value)) {
      setFilterParams({
        page: 1,
        medium: "podcasts",
        type: filterParams.type,
        sort: filterParams.sort,
        range: value,
        category: filterParams.category
      });
    }
  };

  const buttonsNode = (
    <>
      <Dropdown
        key="type"
        value={type}
        menuItems={typeMenuItems}
        onChange={handleTypeChange}
      />
      <Dropdown
        key="sort"
        value={sort}
        menuItems={sortMenuItems}
        onChange={handleSortChange}
      />
      {showRangeDropdown && range && (
        <Dropdown
          key="range"
          value={range}
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

  const headerTitle = filterParams.category ?
    `${tMedia("podcast.podcasts")} > ${tCategories(filterParams.category)}` :
    tMedia("podcast.podcasts");

  return (
    <MainHeader
      title={headerTitle}
      buttonsNode={buttonsNode}
    />
  );
};
