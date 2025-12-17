import { QueryParamsStatsRange,
  getValidQueryParam,
  QUERY_PARAMS_GLOBAL_SORT_VALUES,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  QueryParamsSubscribedFullSort,
  QueryParamsSubscribedType
} from "podverse-helpers";
import { getRangeDropdownItems } from "../../utils/dropdownMenuItems";
import { DropdownMenuItem } from "../../components/Dropdown/Dropdown";

export function getAlbumsDropdownConfig({ type, sort, tFilters }: {
  sort: QueryParamsSubscribedFullSort,
  type: QueryParamsSubscribedType,
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
      { label: tFilters("sort.a_z"), param: "sort", value: "a_z" },
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

type AlbumsDropdownConfigParams = {
  type: QueryParamsSubscribedType | null;
  sort: QueryParamsSubscribedFullSort | null;
  range: QueryParamsStatsRange | null;
  page: number;
}

export type AlbumsDropdownConfigCurrentParams = {
  currentType: QueryParamsSubscribedType;
  currentSort: QueryParamsSubscribedFullSort;
  currentRange: QueryParamsStatsRange | null;
  currentPage: number;
}

export function getAlbumsFilterParams(
  { type, sort, range, page }: AlbumsDropdownConfigParams,
  isValidAuthSession: boolean
): AlbumsDropdownConfigCurrentParams {
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
      QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
      currentSort,
      "a_z"
    )
  } else {
    if (isValidAuthSession) {
      currentType = "subscribed";
      currentSort = getValidQueryParam(
        QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
        currentSort,
        "a_z"
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
