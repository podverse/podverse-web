import React from "react";
import z from "zod";
import { ApiListResponse, DTOItem, getTotalPages,
  QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE, QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT,
  QueryParamsMedium } from "podverse-helpers";
  import { cookies } from 'next/headers';
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { TracksDropdownConfigCurrentParams, getTracksFilterParams } from "./TracksDropdownConfig";
import { TracksClient } from "./TracksClient";
import { getParsedLocalSettings, TracksFilterDefaults } from '../../utils/localSettings/localSettings';

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null)
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type TracksPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TracksPage({ searchParams }: TracksPageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrFilterDefaults = ssrLocalSettings.fd?.tracks;

  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentPage } =
    await parseSearchParams(queryParams, isValidAuthSession, ssrFilterDefaults);
  
  const medium: QueryParamsMedium = "music";
  let response: ApiListResponse<DTOItem> = await ssrApiRequestService.reqItemGetMany({
    page: currentPage,
    medium,
    type: currentType,
    sort: currentSort,
    range: currentRange,
    category: null
  });

  const ssrItems = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);
  
  return (
    <TracksClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        medium
      }}
      ssrItems={ssrItems}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

function parseSearchParams(
  queryParams: SearchParams,
  isAuthenticated: boolean,
  cookieDefaults?: TracksFilterDefaults
): TracksDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentType: cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
      currentSort: cookieDefaults?.sort ?? "recent",
      currentRange: cookieDefaults?.range ?? null,
      currentPage: 1
    };
  }

  const data = parsed.data;

  return getTracksFilterParams({
    page: data.page,
    type: data.type ?? cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
    sort: data.sort ?? cookieDefaults?.sort ?? "recent",
    range: data.range ?? cookieDefaults?.range ?? null
  }, isAuthenticated);
}

