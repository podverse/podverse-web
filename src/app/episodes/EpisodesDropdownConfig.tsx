import { QueryParamsStatsRange,
  CategoryMappingKeys, 
  getValidQueryParam,
  QUERY_PARAMS_GLOBAL_SORT_VALUES,
  QueryParamsSubscribedFullSort,
  QueryParamsSubscribedType,
  QueryParamsSubscribedPartialSort,
  QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT
} from "podverse-helpers";
import { getRangeDropdownItems } from "../../utils/dropdownMenuItems";
import { DropdownMenuItem } from "../../components/Dropdown/Dropdown";

export function getEpisodesDropdownConfig({ type, sort, tFilters }: {
  sort: QueryParamsSubscribedFullSort,
  type: QueryParamsSubscribedType,
  tFilters: (key: string) => string
}) {

  const typeDropdownMenuItems: DropdownMenuItem[] = [
    { label: tFilters("type.global"), param: "type", value: "global" },
    { label: tFilters("type.subscribed"), param: "type", value: "subscribed" },
    { label: tFilters("type.category"), param: "type", value: "category" }
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
  } else if (type === "category") {
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

type EpisodesDropdownConfigParams = {
  type: QueryParamsSubscribedType | null;
  sort: QueryParamsSubscribedPartialSort | null;
  range: QueryParamsStatsRange | null;
  category: CategoryMappingKeys | null;
  page: number;
}

export type EpisodesDropdownConfigCurrentParams = {
  currentType: QueryParamsSubscribedType;
  currentSort: QueryParamsSubscribedPartialSort;
  currentRange: QueryParamsStatsRange | null;
  currentCategory: CategoryMappingKeys | null;
  currentPage: number;
}

export function getEpisodesFilterParams(
  { type, sort, range, category, page }: EpisodesDropdownConfigParams,
  isValidAuthSession: boolean
): EpisodesDropdownConfigCurrentParams {
  let currentType = type;
  let currentSort = sort;
  let currentRange = range;
  let currentCategory = category;
  let currentPage = page;

  if (category) {
    currentType = "category";
    currentSort = getValidQueryParam(
      QUERY_PARAMS_GLOBAL_SORT_VALUES,
      currentSort,
      "recent"
    )
  } else if (type === "global") {
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
      currentCategory = null;
      currentPage = 1;
    } else {
      currentType = "global";
      currentSort = getValidQueryParam(
        QUERY_PARAMS_GLOBAL_SORT_VALUES,
        currentSort,
        "recent"
      )
      currentRange = null;
      currentCategory = null;
      currentPage = 1;
    }
  } 

  return { currentType, currentSort, currentRange, currentCategory, currentPage };
}
