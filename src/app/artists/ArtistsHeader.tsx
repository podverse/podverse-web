"use client";

import { useTranslations } from "next-intl";
import {
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE,
  QueryParamsStatsRange,
  QueryParamsSubscribedFullSort,
  QueryParamsSubscribedMusicType
} from "podverse-helpers";
import React from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import { MainHeader } from "../../components/Main/MainHeader";
import { useArtistsContext } from "./ArtistsContext";
import { getArtistsDropdownConfig } from "./ArtistsDropdownConfig";
import { ViewSelector } from "../../components/ViewSelector/ViewSelector";
import { useLocalSettings } from "../../contexts/LocalSettings";

export const ArtistsHeader: React.FC = () => {
  const { filterParams, setFilterParams } = useArtistsContext();
  const { viewSelected, setViewSelected } = useLocalSettings();
  const { type, sort, range } = filterParams;
  const tMedia = useTranslations('media');
  const tFilters = useTranslations('filters');
  const { typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getArtistsDropdownConfig({ type, sort, tFilters });

  const medium = "publisher-music";

  function isChannelType(val: string): val is QueryParamsSubscribedMusicType {
    return QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE.includes(val as QueryParamsSubscribedMusicType);
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
          medium,
          type: value,
          sort: "recent",
          range: null
        });
      } else if (value === "subscribed") {
        setFilterParams({
          page: 1,
          medium,
          type: value,
          sort: "a_z",
          range: null
        });
      }
    }
  };

  const handleSortChange = (value: string) => {
    if (isChannelSort(value)) {
      if (value === "top") {
        setFilterParams({
          page: 1,
          medium,
          type: filterParams.type,
          sort: value,
          range: "week"
        });
      } else {
        setFilterParams({
          page: 1,
          medium,
          type: filterParams.type,
          sort: value,
          range: filterParams.range
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
        range: value
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

  const headerTitle = tMedia("music.artists");

  return (
    <MainHeader
      title={headerTitle}
      buttonsNode={buttonsNode}
    />
  );
};
