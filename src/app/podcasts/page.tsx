import { getTranslations } from "next-intl/server";
import React from "react";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import Header from "../../components/Header/Header";
import MainWrapper from "../../components/MainWrapper/MainWrapper";
import PodcastList from "../../components/Podcast/PodcastList";
import { getSSRApiRequestService } from "../../factories/apiRequestService";
import { z } from "zod";
import { CATEGORY_MAPPING_KEYS, QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_CHANNELS_SORT_VALUES, QUERY_PARAMS_CHANNELS_TYPE_VALUES, QueryParamsChannelsSort, QueryParamsChannelsType, QueryParamsStatsRange } from "podverse-helpers";
import { getSSRJwtFromCookies } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  type: z.enum(QUERY_PARAMS_CHANNELS_TYPE_VALUES).optional(),
  sort: z.enum(QUERY_PARAMS_CHANNELS_SORT_VALUES).optional(),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional(),
  category: z.enum(CATEGORY_MAPPING_KEYS as [string, ...string[]]).optional(),
});

export default async function Podcasts({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const tMedia = await getTranslations('media');
  const params = searchParams ? await searchParams : {};

  const jwt = await getSSRJwtFromCookies();
  const isAuthenticated = !!jwt;

  const { page, sort, type, range } = await parseSearchParams(params, isAuthenticated);

  const {
    typeMenuItems,
    sortMenuItems,
    rangeMenuItems,
    currentSort,
    currentRange,
    showRangeDropdown
  } = getDropdownConfig(type, sort, range);

  const apiRequestService = getSSRApiRequestService(jwt);
  const response = await apiRequestService.reqChannelGetMany({ page, sort: currentSort, type, range: currentRange });
  const ssrChannels = response.data;
  
  const defaultValueType = isAuthenticated ? "subscribed" : "all";
  const defaultValueSort = isAuthenticated ? "alphabetical" : "top";
  const defaultValueRange = "day";
  
  return (
    <>
      <Header
        title={tMedia("podcast.podcasts")}
        filterDropdowns={[
          <FilterDropdown key="type" defaultValue={defaultValueType} menuItems={typeMenuItems} clearOtherParams />,
          <FilterDropdown key="sort" defaultValue={defaultValueSort} menuItems={sortMenuItems} />,
          showRangeDropdown && <FilterDropdown key="range" defaultValue={defaultValueRange} menuItems={rangeMenuItems} />
        ].filter(Boolean)}
      />
      <MainWrapper>
        <PodcastList ssrChannels={ssrChannels} />
      </MainWrapper>
    </>
  );
}

async function parseSearchParams(params: Record<string, string>, isAuthenticated: boolean) {
  const parsed = searchParamsSchema.safeParse(params);
  if (!parsed.success) {
    console.warn("Invalid search parameters:", parsed.error);
    return {};
  }
  const data = parsed.data;
  if (!data.type) {
    data.type = isAuthenticated ? "subscribed" : "all";
  }
  return data;
}

const typeDropdownMenuItems = [
  { label: "All", param: "type", value: "all" },
  { label: "Subscribed", param: "type", value: "subscribed" },
  { label: "Category", param: "type", value: "category" }
];

const sortDropdownMenuItems = [
  { label: "Recent", param: "sort", value: "recent" },
  { label: "Oldest", param: "sort", value: "oldest" },
  { label: "A - Z", param: "sort", value: "alphabetical" },
  { label: "Top", param: "sort", value: "top" },
];

const rangeDropdownMenuItems = [
  { label: "Day", param: "range", value: "day" },
  { label: "Week", param: "range", value: "week" },
  { label: "Month", param: "range", value: "month" },
  { label: "All Time", param: "range", value: "all-time" },
];

function getDropdownConfig(type?: QueryParamsChannelsType, sort?: QueryParamsChannelsSort, range?: QueryParamsStatsRange) {
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
