import { QueryParamsStatsRange, QueryParamsChannelMusicAlbumSort, QueryParamsChannelMusicAlbumType } from "podverse-helpers";
import { getRangeDropdownItems } from "../../../utils/dropdownMenuItems";

export function getAlbumDropdownConfig({ sort, tFilters }: {
  sort: QueryParamsChannelMusicAlbumSort,
  tFilters: (key: string) => string,
  tMedia: (key: string) => string
}) {
  const sortDropdownMenuItems = [
    { label: tFilters("sort.forward"), param: "sort", value: "forward" },
    { label: tFilters("sort.backward"), param: "sort", value: "backward" },
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

type AlbumDropdownConfigParams = {
  type: QueryParamsChannelMusicAlbumType;
  sort: QueryParamsChannelMusicAlbumSort;
  range: QueryParamsStatsRange | null;
  page: number;
}

export type AlbumDropdownConfigCurrentParams = {
  currentType: QueryParamsChannelMusicAlbumType;
  currentSort: QueryParamsChannelMusicAlbumSort;
  currentRange: QueryParamsStatsRange | null;
  currentPage: number;
}

export function getAlbumFilterParams({ type, sort, range, page }: AlbumDropdownConfigParams): AlbumDropdownConfigCurrentParams {
  let currentType = type;
  let currentSort = sort;
  let currentRange = range;
  let currentPage = page;

  return { currentSort, currentRange, currentType, currentPage };
}
