import { QueryParamsHomeMedium, QueryParamsHomeSort, QueryParamsMedium } from "podverse-helpers";

export function getHomeDropdownConfig({ tMedia, tFilters }: {
  sort?: QueryParamsHomeSort,
  medium?: QueryParamsHomeMedium,
  tMedia: (key: string) => string,
  tFilters: (key: string) => string
}) {
  let mediumDropdownMenuItems = [
    { label: tFilters("type.all"), param: "medium", value: "all" },
    { label: tMedia("podcast.podcasts"), param: "medium", value: "podcasts" },
    { label: tMedia("video.videos"), param: "medium", value: "videos" },
    { label: tMedia("music.music"), param: "medium", value: "music" }
  ];

  let sortDropdownMenuItems = [
    { label: tFilters("sort.recent"), param: "sort", value: "recent" },
    { label: tFilters("sort.a_z"), param: "sort", value: "a_z" }
  ];
  
  return {
    mediumMenuItems: mediumDropdownMenuItems,
    sortMenuItems: sortDropdownMenuItems
  };
}

type QueryParamConfig = {
  medium: QueryParamsMedium;
  sort?: QueryParamsHomeSort;
}

export function getHomeFilterParams({ medium, sort }: QueryParamConfig) {
  let currentSort = sort;
  let currentMedium = medium;

  return { currentSort, currentMedium };
}
