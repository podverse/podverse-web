import { DTOChannel, getTotalPages, QUERY_PARAMS_HOME_SORT_VALUES,
  QUERY_PARAMS_MEDIUMS } from "podverse-helpers";
import React from "react";
import z from "zod";
import { HomeClient } from "./HomeClient";
import { getSSRAuthService } from "../utils/auth/ssrAuth";
import { getHomeFilterParams } from "./HomeDropdownConfig";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  medium: z.enum(QUERY_PARAMS_MEDIUMS).optional(),
  sort: z.enum(QUERY_PARAMS_HOME_SORT_VALUES).optional()
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();

  const queryParams = searchParams ? await searchParams : {};
  const { page = 1, sort, medium } = await parseSearchParams(queryParams);
  const { currentMedium, currentSort } = getHomeFilterParams({ medium, sort });

  let ssrChannels: DTOChannel[] = [];
  let ssrTotalPages = 1;
  
  if (isValidAuthSession) {
    const response = await apiRequestService.reqChannelGetMany({
      page,
      sort: currentSort,
      type: "subscribed",
      medium: currentMedium
    });
    ssrChannels = response.data;
    ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit);
  }
  
  return (
    <HomeClient
      isValidAuthSession={isValidAuthSession}
      initialQueryParams={{ page, medium, sort }}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

async function parseSearchParams(queryParams: SearchParams) {
  const parsed = searchParamsSchema.safeParse(queryParams);
  
  if (!parsed.success) {
    return {};
  }
  
  const data = parsed.data;

  if (!data.medium && !data.sort) {
    data.medium = "all";
    data.sort = "recent";
  }

  return data;
}
