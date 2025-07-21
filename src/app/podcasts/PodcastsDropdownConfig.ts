import { QueryParamsChannelsType, QueryParamsChannelsSort, QueryParamsStatsRange } from "podverse-helpers";

export function getDropdownConfig({ type, sort, tFilters }: {
  sort?: QueryParamsChannelsSort,
  type?: QueryParamsChannelsType,
  tFilters: (key: string) => string
}) {
  const sortTop = { label: tFilters("sort.top"), param: "sort", value: "top" };

  let typeDropdownMenuItems = [
    { label: tFilters("type.all"), param: "type", value: "all" },
    { label: tFilters("type.subscribed"), param: "type", value: "subscribed" },
    { label: tFilters("type.category"), param: "type", value: "category" }
  ];

  let sortDropdownMenuItems = [
    { label: tFilters("sort.recent"), param: "sort", value: "recent" },
    { label: tFilters("sort.oldest"), param: "sort", value: "oldest" },
    { label: tFilters("sort.a_z"), param: "sort", value: "alphabetical" },
    sortTop
  ];

  let rangeDropdownMenuItems = [
    { label: tFilters("range.day"), param: "range", value: "day" },
    { label: tFilters("range.week"), param: "range", value: "week" },
    { label: tFilters("range.month"), param: "range", value: "month" },
    { label: tFilters("range.all_time"), param: "range", value: "all-time" },
  ];

  if (type === "all" || type === "category") {
    sortDropdownMenuItems = [sortTop];
  }
  
  let showRangeDropdown = false;
  if (sort === "top") {
    showRangeDropdown = true;
  }

  return {
    typeMenuItems: typeDropdownMenuItems,
    sortMenuItems: sortDropdownMenuItems,
    rangeMenuItems: rangeDropdownMenuItems,
    showRangeDropdown,
  };
}

type QueryParamConfig = {
  type?: QueryParamsChannelsType;
  sort?: QueryParamsChannelsSort;
  range?: QueryParamsStatsRange;
}

export function getCurrentSortAndRange({ type, sort, range }: QueryParamConfig) {
  let currentSort = sort;
  let currentRange = range;

  if (type === "all" || type === "category") {
    currentSort = "top";
    currentRange = currentRange || "day";
  } else if (type === "subscribed") {
    currentSort = currentSort || "alphabetical";
  }

  return { currentSort, currentRange };
}
