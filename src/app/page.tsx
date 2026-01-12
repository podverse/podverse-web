import { DTOChannel, getTotalPages, QUERY_PARAMS_HOME_SORT_VALUES,
  QUERY_PARAMS_MEDIUMS } from "podverse-helpers";
import React from "react";
import { cookies } from 'next/headers';
import z from "zod";
import { HomeClient } from "./HomeClient";
import { getSSRAuthService } from "../utils/auth/ssrAuth";
import { getHomeFilterParams, HomeDropdownConfigCurrentParams } from "./HomeDropdownConfig";
import { getParsedLocalSettings, HomeFilterDefaults } from '../utils/localSettings/localSettings';

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  medium: z.enum(QUERY_PARAMS_MEDIUMS).optional().default("all"),
  sort: z.enum(QUERY_PARAMS_HOME_SORT_VALUES).optional().default("recent")
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrFilterDefaults = ssrLocalSettings.fd?.home;

  const queryParams = await searchParams;
  const { currentPage, currentMedium, currentSort } = await parseSearchParams(queryParams, ssrFilterDefaults);
  

  let ssrChannels: DTOChannel[] = [];
  let ssrTotalPages = 1;
  
  if (isValidAuthSession) {
    const response = await ssrApiRequestService.reqChannelGetMany({
      page: currentPage,
      sort: currentSort,
      type: "subscribed",
      medium: currentMedium,
      range: null,
      category: null
    });
    ssrChannels = response.data;
    ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);
  }
  
  return (
    <HomeClient
      isValidAuthSession={isValidAuthSession}
      initialQueryParams={{
        page: currentPage,
        medium: currentMedium,
        sort: currentSort
      }}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

function parseSearchParams(queryParams: SearchParams, cookieDefaults?: HomeFilterDefaults): HomeDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentPage: 1,
      currentMedium: cookieDefaults?.medium ?? "all",
      currentSort: cookieDefaults?.sort ?? "recent"
    };
  }

  const data = parsed.data;

  return getHomeFilterParams({
    page: data.page ?? 1,
    medium: data.medium ?? cookieDefaults?.medium ?? "all",
    sort: data.sort ?? cookieDefaults?.sort ?? "recent"
  });
}
