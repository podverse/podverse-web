import { QueryParamsStatsRange, QueryParamsPlaylistsType, QueryParamsPlaylistsSort } from "podverse-helpers";
import { getRangeDropdownItems } from "../../utils/dropdownMenuItems";

export function getPlaylistsDropdownConfig({ type, sort, tFilters, tMedia }: {
  sort?: QueryParamsPlaylistsSort,
  type?: QueryParamsPlaylistsType,
  tFilters: (key: string) => string,
  tMedia: (key: string) => string
}) {
  const sortTop = { label: tFilters("sort.top"), param: "sort", value: "top" };

  let sortDropdownMenuItems = [
    sortTop,
  ];

  const rangeDropdownMenuItems = getRangeDropdownItems(tFilters);
  
  let showRangeDropdown = false;  
  if (sort === "top") {
    showRangeDropdown = true;
  }

  return {
    sortMenuItems: sortDropdownMenuItems,
    rangeMenuItems: rangeDropdownMenuItems,
    showRangeDropdown
  };
}

type QueryParamConfig = {
  type?: QueryParamsPlaylistsType;
  sort?: QueryParamsPlaylistsSort;
  range?: QueryParamsStatsRange;
}

export function getPlaylistsFilterParams({ type, sort, range }: QueryParamConfig) {
  let currentSort = sort;
  let currentRange = range;
  let currentType = type;

  return { currentSort, currentRange, currentType };
}
