import { getTranslations } from "next-intl/server";
import React from "react";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import Header from "../../components/Header/Header";
import MainWrapper from "../../components/MainWrapper/MainWrapper";
import PodcastList from "../../components/Podcast/PodcastList";
import { getSSRApiRequestService } from "../../factories/apiRequestService";
import { z } from "zod";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  sort: z.enum(["recent", "oldest", "alphabetical", "top"]).optional()
});

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

export default async function Podcasts({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const tMedia = await getTranslations('media');
  const params = searchParams ? await searchParams : {};
  const { page, sort, type = "all", range } = await parseSearchParams(params);
  let currentSort = sort;
  let currentRange = range;

  // Conditional logic for dropdowns and defaults
  let typeMenuItems = typeDropdownMenuItems;
  let sortMenuItems = sortDropdownMenuItems;
  let showRangeDropdown = false;
  let rangeMenuItems = rangeDropdownMenuItems;

  if (type === "all") {
    sortMenuItems = [{ label: "Top", param: "sort", value: "top" }];
    currentSort = "top";
    showRangeDropdown = true;
    rangeMenuItems = rangeDropdownMenuItems;
    currentRange = currentRange || "day";
  } else if (type === "subscribed") {
    sortMenuItems = sortDropdownMenuItems;
    currentSort = currentSort || "alphabetical";
    showRangeDropdown = false;
    rangeMenuItems = [];
  } else if (type === "category") {
    sortMenuItems = [{ label: "Top", param: "sort", value: "top" }];
    currentSort = "top";
    showRangeDropdown = true;
    rangeMenuItems = rangeDropdownMenuItems;
    currentRange = currentRange || "day";
  }

  // Only show range dropdown when sort is "top"
  if (currentSort !== "top") {
    showRangeDropdown = false;
    rangeMenuItems = [];
  }

  const apiRequestService = getSSRApiRequestService();
  // Pass all params to API
  const response = await apiRequestService.reqChannelGetMany({ page, sort: currentSort, type, range: currentRange });

  return (
    <>
      <Header
        title={tMedia("podcast.podcasts")}
        filterDropdowns={[
          <FilterDropdown key="type" menuItems={typeMenuItems} />, 
          <FilterDropdown key="sort" menuItems={sortMenuItems} />, 
          showRangeDropdown && <FilterDropdown key="range" menuItems={rangeMenuItems} />
        ].filter(Boolean)}
      />
      <MainWrapper>
        <PodcastList
          ssrChannels={response?.data ?? []}
          ssrPage={page}
        />
      </MainWrapper>
    </>
  );
}

async function parseSearchParams(params: Record<string, string>) {
  // Accept type and range in addition to page/sort
  const extendedSchema = searchParamsSchema.extend({
    type: z.string().optional(),
    range: z.string().optional(),
  });
  const parsed = extendedSchema.safeParse(params);
  if (!parsed.success) {
    console.warn("Invalid search parameters:", parsed.error);
    return {};
  }
  return parsed.data;
}
