import { QueryParamsChannelsType, QueryParamsChannelsSort, QueryParamsStatsRange } from "podverse-helpers";

export const typeDropdownMenuItems = [
  { label: "All", param: "type", value: "all" },
  { label: "Subscribed", param: "type", value: "subscribed" },
  { label: "Category", param: "type", value: "category" }
];

export const sortDropdownMenuItems = [
  { label: "Recent", param: "sort", value: "recent" },
  { label: "Oldest", param: "sort", value: "oldest" },
  { label: "A - Z", param: "sort", value: "alphabetical" },
  { label: "Top", param: "sort", value: "top" },
];

export const rangeDropdownMenuItems = [
  { label: "Day", param: "range", value: "day" },
  { label: "Week", param: "range", value: "week" },
  { label: "Month", param: "range", value: "month" },
  { label: "All Time", param: "range", value: "all-time" },
];

export function getDropdownConfig(type?: QueryParamsChannelsType, sort?: QueryParamsChannelsSort, range?: QueryParamsStatsRange) {
  let currentSort = sort;
  let currentRange = range;
  let showRangeDropdown = false;

  let typeMenuItems = typeDropdownMenuItems;
  let sortMenuItems = sortDropdownMenuItems;
  let rangeMenuItems = rangeDropdownMenuItems;

  if (type === "all" || type === "category") {
    sortMenuItems = [{ label: "Top", param: "sort", value: "top" }];
    currentSort = "top";
    currentRange = currentRange || "day";
  } else if (type === "subscribed") {
    sortMenuItems = sortDropdownMenuItems;
    currentSort = currentSort || "alphabetical";
  }

  if (currentSort !== "top") {
    showRangeDropdown = false;
    rangeMenuItems = [];
  } else {
    showRangeDropdown = true;
  }

  return { typeMenuItems, sortMenuItems, rangeMenuItems, currentSort, currentRange, showRangeDropdown };
}
