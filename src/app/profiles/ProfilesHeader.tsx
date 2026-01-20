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
import { useProfilesContext } from "./ProfilesContext";
import { getProfilesDropdownConfig } from "./ProfilesDropdownConfig";

export const ProfilesHeader: React.FC = () => {
  const { filterParams, setFilterParams } = useProfilesContext();
  const { type, sort, range } = filterParams;
  const tFeatures = useTranslations('features');
  const tFilters = useTranslations('filters');

  function isProfileType(val: string): val is QueryParamsSubscribedType {
    return QUERY_PARAMS_SUBSCRIBED_TYPE.includes(val as QueryParamsSubscribedType);
  }
  function isProfileSort(val: string): val is QueryParamsSubscribedFullSort {
    return QUERY_PARAMS_SUBSCRIBED_FULL_SORT.includes(val as QueryParamsSubscribedFullSort);
  }
  function isStatsRange(val: string): val is QueryParamsStatsRange {
    return QUERY_PARAMS_STATS_RANGE_VALUES.includes(val as QueryParamsStatsRange);
  }

  const { typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown } = getProfilesDropdownConfig({ type, sort, tFilters });

  const handleTypeChange = (value: string) => {
    if (isProfileType(value)) {
      if (value === "global") {
        setFilterParams({
          page: 1,
          type: value,
          sort: "recent",
          range: null
        });
      } else if (value === "subscribed") {
        setFilterParams({
          page: 1,
          type: value,
          sort: "a_z",
          range: null
        });
      }
    }
  };

  const handleSortChange = (value: string) => {
    if (isProfileSort(value)) {
      if (value === "top") {
        setFilterParams({
          page: 1,
          type: filterParams.type,
          sort: value,
          range: "week"
        });
      } else {
        setFilterParams({
          page: 1,
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
    </>
  );

  return (
    <MainHeader
      title={tFeatures("profiles")}
      buttonsNode={buttonsNode}
    />
  );
};
