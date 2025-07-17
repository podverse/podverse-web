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
  sort: z.enum(["recent", "oldest"]).optional()
});

const typeDropdownMenuItems = [
  { label: "All", param: "type", value: "all" },
  { label: "Subscribed", param: "type", value: "subscribed" },
  { label: "Category", param: "type", value: "category" }
];

const sortDropdownMenuItems = [
  { label: "Recent", param: "sort", value: "recent" },
  { label: "Oldest", param: "sort", value: "oldest" },
  { label: "A - Z", param: "sort", value: "alphabetical" }
];

export default async function Podcasts({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const tMedia = await getTranslations('media');
  const params = searchParams ? await searchParams : {};
  const { page, sort } = await parseSearchParams(params);
  const apiRequestService = getSSRApiRequestService();
  const response = await apiRequestService.reqChannelGetMany({ page, sort });

  return (
    <>
      <Header
        title={tMedia("podcast.podcasts")}
        filterDropdowns={[
          <FilterDropdown key="type" menuItems={typeDropdownMenuItems} />,
          <FilterDropdown key="sort" menuItems={sortDropdownMenuItems} />
        ]}
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
  const parsed = searchParamsSchema.safeParse(params);

  if (!parsed.success) {
    console.warn("Invalid search parameters:", parsed.error);
    return {};
  }

  return parsed.data;
}
