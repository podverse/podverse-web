import { QueryParamsChannelType, QueryParamsChannelSort, QueryParamsStatsRange } from "podverse-helpers";
import { getRangeDropdownItems } from "../../../utils/dropdownMenuItems";

export function getPodcastDropdownConfig({ type, sort, tFilters, tMedia }: {
  sort?: QueryParamsChannelSort,
  type?: QueryParamsChannelType,
  tFilters: (key: string) => string,
  tMedia: (key: string) => string
}) {
  const sortDropdownMenuItems = [
    { label: tFilters("sort.recent"), param: "sort", value: "recent" },
    { label: tFilters("sort.oldest"), param: "sort", value: "oldest" },
    { label: tFilters("sort.top"), param: "sort", value: "top" },
  ];

  const rangeDropdownMenuItems = getRangeDropdownItems(tFilters);
  
  const showRangeDropdown = sort === "top";  

  return {
    sortMenuItems: sortDropdownMenuItems,
    rangeMenuItems: rangeDropdownMenuItems,
    showRangeDropdown
  };
}

type QueryParamConfig = {
  type?: QueryParamsChannelType;
  sort?: QueryParamsChannelSort;
  range?: QueryParamsStatsRange;
}

export function getPodcastFilterParams({ type, sort, range }: QueryParamConfig) {
  let currentSort = sort;
  let currentRange = range;
  let currentType = type;

  return { currentSort, currentRange, currentType };
}
