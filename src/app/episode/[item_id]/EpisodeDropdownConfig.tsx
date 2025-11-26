import { QueryParamsStatsRange, QueryParamsItemType, QueryParamsItemSort } from "podverse-helpers";
import { getRangeDropdownItems } from "../../../utils/dropdownMenuItems";

export function getEpisodeDropdownConfig({ sort, tFilters }: {
  sort: QueryParamsItemSort,
  tFilters: (key: string) => string
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

type EpisodeDropdownConfigParams = {
  type: QueryParamsItemType;
  sort: QueryParamsItemSort;
  range: QueryParamsStatsRange | null;
  page: number;
}

export type EpisodeDropdownConfigCurrentParams = {
  currentType: QueryParamsItemType;
  currentSort: QueryParamsItemSort;
  currentRange: QueryParamsStatsRange | null;
  currentPage: number;
}

export function getEpisodeFilterParams({ type, sort, range, page }: EpisodeDropdownConfigParams): EpisodeDropdownConfigCurrentParams {
  let currentSort = sort;
  let currentRange = range;
  let currentType = type;
  let currentPage = page;

  if (type === "soundbites") {
    if (sort === "top") {
      currentSort = "recent";
    }
  }

  return { currentSort, currentRange, currentType, currentPage };
}
