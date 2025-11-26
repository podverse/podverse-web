import { QueryParamsChannelType, QueryParamsChannelSort, QueryParamsStatsRange,
  QueryParamsGlobalSort } from "podverse-helpers";
import { getRangeDropdownItems } from "../../../utils/dropdownMenuItems";

export function getPodcastDropdownConfig({ sort, tFilters }: {
  sort: QueryParamsChannelSort,
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

type PodcastDropdownConfigParams = {
  type: QueryParamsChannelType;
  sort: QueryParamsGlobalSort;
  range: QueryParamsStatsRange | null;
  page: number;
}

export type PodcastDropdownConfigCurrentParams = {
  currentType: QueryParamsChannelType;
  currentSort: QueryParamsGlobalSort;
  currentRange: QueryParamsStatsRange | null;
  currentPage: number;
}

export function getPodcastFilterParams({ type, sort, range, page }: PodcastDropdownConfigParams): PodcastDropdownConfigCurrentParams {
  let currentType = type;
  let currentSort = sort;
  let currentRange = range;
  let currentPage = page;

  return { currentSort, currentRange, currentType, currentPage };
}
