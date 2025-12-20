"use client";

import { useTranslations } from "next-intl";
import {
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT,
  QUERY_PARAMS_SUBSCRIBED_TYPE,
  QueryParamsStatsRange,
  QueryParamsSubscribedPartialSort,
  QueryParamsSubscribedType,
} from "podverse-helpers";
import React from "react";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { MainHeader } from "../../../components/Main/MainHeader";
import { ViewSelector } from "../../../components/ViewSelector/ViewSelector";
import { useLocalSettings } from "../../../contexts/LocalSettings";
import { useLivestreamsContext } from "./LivestreamsContext";
import { getEpisodesDropdownConfig } from "../../episodes/EpisodesDropdownConfig";

type LivestreamsHeaderProps = {
  medium: "av" | "music"
};

export const LivestreamsHeader: React.FC<LivestreamsHeaderProps> = ({ medium }) => {
  const { filterParams, setFilterParams, setShowCategoriesModal } = useLivestreamsContext();
  const { viewSelected, setViewSelected } = useLocalSettings();
  const { type, sort, range } = filterParams;
  const tMedia = useTranslations('media');
  const tFilters = useTranslations('filters');
  const tCategories = useTranslations('categories');
  const { typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getEpisodesDropdownConfig({ type, sort, tFilters, medium });

  function isItemType(val: string): val is QueryParamsSubscribedType {
    return QUERY_PARAMS_SUBSCRIBED_TYPE.includes(val as QueryParamsSubscribedType);
  }
  function isItemSort(val: string): val is QueryParamsSubscribedPartialSort {
    return QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT.includes(val as QueryParamsSubscribedPartialSort);
  }
  function isStatsRange(val: string): val is QueryParamsStatsRange {
    return QUERY_PARAMS_STATS_RANGE_VALUES.includes(val as QueryParamsStatsRange);
  }

  const handleTypeChange = (value: string) => {
    if (isItemType(value)) {
      if (value === "global") {
        setFilterParams({
          page: 1,
          medium,
          type: value,
          sort: "recent",
          range: null,
          category: null,
          liveItemType: filterParams.liveItemType
        });
      } else if (value === "category") {
        setShowCategoriesModal(true);
      } else if (value === "subscribed") {
        setFilterParams({
          page: 1,
          medium,
          type: value,
          sort: "recent",
          range: null,
          category: null,
          liveItemType: filterParams.liveItemType
        });
      }
    }
  };

  const handleSortChange = (value: string) => {
    if (isItemSort(value)) {
      if (value === "top") {
        setFilterParams({
          page: 1,
          medium,
          type: filterParams.type,
          sort: value,
          range: "week",
          category: filterParams.category,
          liveItemType: filterParams.liveItemType
        });
      } else {
        setFilterParams({
          page: 1,
          medium,
          type: filterParams.type,
          sort: value,
          range: filterParams.range,
          category: filterParams.category,
          liveItemType: filterParams.liveItemType
        });
      }
    }
  };

  const handleRangeChange = (value: string) => {
    if (isStatsRange(value)) {
      setFilterParams({
        page: 1,
        medium,
        type: filterParams.type,
        sort: filterParams.sort,
        range: value,
        category: filterParams.category,
        liveItemType: filterParams.liveItemType
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
    `${tMedia("livestream.livestreams")} > ${tCategories(filterParams.category)}` :
    tMedia("livestream.livestreams");

  return (
    <MainHeader
      title={headerTitle}
      buttonsNode={buttonsNode}
    />
  );
};
