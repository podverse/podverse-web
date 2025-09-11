import { QueryParamsChannelType, QueryParamsChannelSort, QueryParamsStatsRange } from "podverse-helpers";
import { getRangeDropdownItems } from "../../../utils/dropdownMenuItems";

export function getPodcastDropdownConfig({ type, sort, tFilters, tMedia }: {
  sort?: QueryParamsChannelSort,
  type?: QueryParamsChannelType,
  tFilters: (key: string) => string,
  tMedia: (key: string) => string
}) {
  const sortTop = { label: tFilters("sort.top"), param: "sort", value: "top" };

  let typeDropdownMenuItems = [
    { label: tMedia("podcast.episodes"), param: "type", value: "episodes" },
    { label: tMedia("clips"), param: "type", value: "clips" }
  ];

  let sortDropdownMenuItems = [
    { label: tFilters("sort.recent"), param: "sort", value: "recent" },
    { label: tFilters("sort.oldest"), param: "sort", value: "oldest" },
    sortTop,
    { label: tFilters("sort.random"), param: "sort", value: "random" },
  ];

  const rangeDropdownMenuItems = getRangeDropdownItems(tFilters);
  
  let showRangeDropdown = false;  
  if (sort === "top") {
    showRangeDropdown = true;
  }

  return {
    typeMenuItems: typeDropdownMenuItems,
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

export function getPodcastQueryParams({ type, sort, range }: QueryParamConfig) {
  let currentSort = sort;
  let currentRange = range;
  let currentType = type;

  return { currentSort, currentRange, currentType };
}
