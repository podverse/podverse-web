import { QueryParamsStatsRange, QueryParamsPlaylistsType, QueryParamsPlaylistsSort, MediumEnum } from "podverse-helpers";
import { getRangeDropdownItems } from "../../utils/dropdownMenuItems";

type GetPlaylistsDropdownConfig = {
  sort?: QueryParamsPlaylistsSort,
  type?: QueryParamsPlaylistsType,
  tFilters: (key: string) => string
}

export function getPlaylistsDropdownConfig({ sort, type, tFilters }: GetPlaylistsDropdownConfig) {
  const sortTop = { label: tFilters("sort.top"), param: "sort", value: "top" };

  let sortDropdownMenuItems = [
    sortTop,
  ];

  if (type === "global") {
    sortDropdownMenuItems = [
      sortTop
    ]
  } else if (type === "my_playlists" || type === "subscribed") {
    sortDropdownMenuItems = [
      sortTop,
      { label: tFilters("sort.a_z"), param: "sort", value: "a_z" },
      { label: tFilters("sort.recent"), param: "sort", value: "recent" },
      { label: tFilters("sort.oldest"), param: "sort", value: "oldest" }
    ]
  }

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
  medium_id?: MediumEnum | null;
}

export function getPlaylistsFilterParams({ type, sort, range, medium_id }: QueryParamConfig) {
  const currentSort = sort;
  const currentRange = range;
  const currentType = type;
  const currentMediumId = medium_id;

  return { currentSort, currentRange, currentType, currentMediumId };
}
