import { QueryParamsStatsRange, QueryParamsPlaylistsType,
  getValidQueryParam, QUERY_PARAMS_SUBSCRIBED_FULL_SORT, 
  QueryParamsSubscribedFullSort,
  QueryParamsQueueMedium} from "podverse-helpers";
import { getRangeDropdownItems } from "../../utils/dropdownMenuItems";

type GetPlaylistsDropdownConfig = {
  sort: QueryParamsSubscribedFullSort,
  type: QueryParamsPlaylistsType,
  tFilters: (key: string) => string
}

export function getPlaylistsDropdownConfig({ sort, type, tFilters }: GetPlaylistsDropdownConfig) {
  let sortDropdownMenuItems = [
    { label: tFilters("sort.top"), param: "sort", value: "top" }
  ];

  if (type === "public") {
    sortDropdownMenuItems = [
      { label: tFilters("sort.top"), param: "sort", value: "top" }
    ]
  } else if (type === "private" || type === "private_followed") {
    sortDropdownMenuItems = [
      { label: tFilters("sort.top"), param: "sort", value: "top" },
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

type PlaylistsDropdownConfigParams = {
  type: QueryParamsPlaylistsType | null;
  sort: QueryParamsSubscribedFullSort | null;
  range: QueryParamsStatsRange | null;
  medium: QueryParamsQueueMedium;
  page: number;
}

export type PlaylistsDropdownConfigCurrentParams = {
  currentType: QueryParamsPlaylistsType;
  currentSort: QueryParamsSubscribedFullSort;
  currentRange: QueryParamsStatsRange | null;
  currentMedium: QueryParamsQueueMedium;
  currentPage: number;
}

export function getPlaylistsFilterParams(
  { type, sort, range, medium, page }: PlaylistsDropdownConfigParams,
  isValidAuthSession: boolean
): PlaylistsDropdownConfigCurrentParams {
  let currentType = type;
  let currentSort = sort;
  let currentRange = range;
  let currentMedium = medium;
  let currentPage = page;

  if (type === "private") {
    currentType = "private";
    currentSort = getValidQueryParam(
      QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
      currentSort,
      "a_z"
    );
  } else if (type === "public") {
    currentType = "public";
    currentSort = getValidQueryParam(
      QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
      currentSort,
      "recent"
    )
  } else if (type === "private_followed") {
    currentType = "private_followed";
    currentSort = getValidQueryParam(
      QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
      currentSort,
      "a_z"
    )
  } else {
    if (isValidAuthSession) {
      currentType = "private";
      currentSort = getValidQueryParam(
        QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
        currentSort,
        "a_z"
      );
    } else {
      currentType = "public";
      currentSort = getValidQueryParam(
        QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
        currentSort,
        "recent"
      )
    }
  }

  return { currentType, currentSort, currentRange, currentMedium, currentPage };
}
