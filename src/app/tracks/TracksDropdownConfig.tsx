import { QueryParamsStatsRange,
  getValidQueryParam,
  QUERY_PARAMS_GLOBAL_SORT_VALUES,
  QueryParamsSubscribedFullSort,
  QueryParamsSubscribedPartialSort,
  QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT,
  QueryParamsSubscribedMusicType
} from "podverse-helpers";
import { getRangeDropdownItems } from "../../utils/dropdownMenuItems";
import { DropdownMenuItem } from "../../components/Dropdown/Dropdown";

export function getTracksDropdownConfig({ type, sort, tFilters }: {
  sort: QueryParamsSubscribedFullSort,
  type: QueryParamsSubscribedMusicType,
  tFilters: (key: string) => string
}) {

  const typeDropdownMenuItems: DropdownMenuItem[] = [
    { label: tFilters("type.global"), param: "type", value: "global" },
    { label: tFilters("type.subscribed"), param: "type", value: "subscribed" }
  ];
  let sortDropdownMenuItems: DropdownMenuItem[] = [];
  let rangeDropdownMenuItems = getRangeDropdownItems(tFilters);
  let showRangeDropdown = false;

  if (type === "global") {
    sortDropdownMenuItems = [
      { label: tFilters("sort.recent"), param: "sort", value: "recent" },
      { label: tFilters("sort.top"), param: "sort", value: "top" }
    ];
  } else if (type === "subscribed") {
    sortDropdownMenuItems = [
      { label: tFilters("sort.recent"), param: "sort", value: "recent" },
      { label: tFilters("sort.top"), param: "sort", value: "top" }
    ];
  }

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

type TracksDropdownConfigParams = {
  type: QueryParamsSubscribedMusicType | null;
  sort: QueryParamsSubscribedPartialSort | null;
  range: QueryParamsStatsRange | null;
  page: number;
}

export type TracksDropdownConfigCurrentParams = {
  currentType: QueryParamsSubscribedMusicType;
  currentSort: QueryParamsSubscribedPartialSort;
  currentRange: QueryParamsStatsRange | null;
  currentPage: number;
}

export function getTracksFilterParams(
  { type, sort, range, page }: TracksDropdownConfigParams,
  isValidAuthSession: boolean
): TracksDropdownConfigCurrentParams {
  let currentType = type;
  let currentSort = sort;
  let currentRange = range;
  let currentPage = page;

  if (type === "global") {
    currentType = "global";
    currentSort = getValidQueryParam(
      QUERY_PARAMS_GLOBAL_SORT_VALUES,
      currentSort,
      "recent"
    )
  } else if (type === "subscribed") {
    currentType = "subscribed";
    currentSort = getValidQueryParam(
      QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT,
      currentSort,
      "recent"
    )
  } else {
    if (isValidAuthSession) {
      currentType = "subscribed";
      currentSort = getValidQueryParam(
        QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT,
        currentSort,
        "recent"
      );
      currentRange = null;
      currentPage = 1;
    } else {
      currentType = "global";
      currentSort = getValidQueryParam(
        QUERY_PARAMS_GLOBAL_SORT_VALUES,
        currentSort,
        "recent"
      )
      currentRange = null;
      currentPage = 1;
    }
  } 

  return { currentType, currentSort, currentRange, currentPage };
}
