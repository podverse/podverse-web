"use client";

import { useTranslations } from "next-intl";
import { 
  QUERY_PARAMS_HOME_SORT_VALUES,
  QueryParamsHomeSort,
  QueryParamsMedium,
  QUERY_PARAMS_MEDIUMS
} from "podverse-helpers";
import React from "react";
import Dropdown from "../components/Dropdown/Dropdown";
import { MainHeader } from "../components/Main/MainHeader";
import { ViewSelector } from "../components/ViewSelector/ViewSelector";
import { useLocalSettings } from "../contexts/LocalSettings";
import { useHomeContext } from "./HomeContext";
import { getHomeDropdownConfig } from "./HomeDropdownConfig";

export const HomeHeader: React.FC = () => {
  const { filterParams, setFilterParams } = useHomeContext();
  const { viewSelected, setViewSelected } = useLocalSettings();
  const { sort, medium } = filterParams;
  const tMedia = useTranslations('media');
  const tFilters = useTranslations('filters');
  const tSubscriptions = useTranslations("subscriptions");
  const { mediumMenuItems, sortMenuItems } = getHomeDropdownConfig({ medium, sort, tFilters, tMedia });

  function isMedium(val: string): val is QueryParamsMedium {
    return QUERY_PARAMS_MEDIUMS.includes(val as QueryParamsMedium);
  }
  function isHomeSort(val: string): val is QueryParamsHomeSort {
    return QUERY_PARAMS_HOME_SORT_VALUES.includes(val as QueryParamsHomeSort);
  }

  const handleMediumChange = (value: string) => {
    if (isMedium(value)) {
      setFilterParams({ ...filterParams, medium: value, page: 1  });
    }
  };

  const handleSortChange = (value: string) => {
    if (isHomeSort(value)) {
      setFilterParams({ ...filterParams, sort: value, page: 1 });
    }
  };

  const buttonsNode = (
    <>
      <Dropdown
        key="medium"
        value={medium ?? ""}
        menuItems={mediumMenuItems}
        onChange={handleMediumChange}
      />
      <Dropdown
        key="sort"
        value={sort ?? ""}
        menuItems={sortMenuItems}
        onChange={handleSortChange}
      />
      <ViewSelector
        viewSelected={viewSelected}
        setViewSelected={setViewSelected}
      />
    </>
  );

  return (
    <MainHeader
      title={tSubscriptions("subscriptions")}
      buttonsNode={buttonsNode}
    />
  );
};
