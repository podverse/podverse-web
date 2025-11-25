import { QueryParamsStatsRange,
  CategoryMappingKeys, 
  getValidQueryParam,
  QUERY_PARAMS_GLOBAL_SORT_VALUES,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  QueryParamsSubscribedFullSort,
  QueryParamsSubscribedType
} from "podverse-helpers";
import { getRangeDropdownItems } from "../../utils/dropdownMenuItems";

export function getPodcastsDropdownConfig({ type, sort, category, tFilters }: {
  sort?: QueryParamsSubscribedFullSort,
  type?: QueryParamsSubscribedType,
  category?: CategoryMappingKeys | null,
  tFilters: (key: string) => string
}) {
  const sortRecent = { label: tFilters("sort.recent"), param: "sort", value: "recent" };
  const sortTop = { label: tFilters("sort.top"), param: "sort", value: "top" };

  let typeDropdownMenuItems = [
    { label: tFilters("type.global"), param: "type", value: "global" },
    { label: tFilters("type.subscribed"), param: "type", value: "subscribed" },
    { label: tFilters("type.category"), param: "type", value: "category" }
  ];

  let sortDropdownMenuItems = [
    sortRecent,
    { label: tFilters("sort.oldest"), param: "sort", value: "oldest" },
    { label: tFilters("sort.a_z"), param: "sort", value: "a_z" },
    sortTop
  ];

  let rangeDropdownMenuItems = getRangeDropdownItems(tFilters);
  
  let showRangeDropdown = false;
  if (type === "global" || category) {
    sortDropdownMenuItems = [sortRecent, sortTop];
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

type QueryParamConfig = {
  type?: QueryParamsSubscribedType;
  sort?: QueryParamsSubscribedFullSort;
  range?: QueryParamsStatsRange;
  category?: CategoryMappingKeys | null;
}

export function getPodcastsFilterParams({ type, sort, range, category }: QueryParamConfig) {
  let currentSort = sort;
  let currentRange = range;
  let currentType = type;

  if (category || type === "category") {
    currentType = "category";
    currentSort = getValidQueryParam(
      QUERY_PARAMS_GLOBAL_SORT_VALUES,
      currentSort,
      "recent"
    )
  } else if (type === "global") {
    currentSort = getValidQueryParam(
      QUERY_PARAMS_GLOBAL_SORT_VALUES,
      currentSort,
      "recent"
    )
  } else if (type === "subscribed") {
    currentSort = getValidQueryParam(
      QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
      currentSort,
      "a_z"
    )
  }

  return { currentSort, currentRange, currentType };
}
