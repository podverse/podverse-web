import React from "react";
import z from "zod";
import { ApiListResponse, CATEGORY_MAPPING_KEYS, DTOClip, getTotalPages,
  QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT,
  QUERY_PARAMS_SUBSCRIBED_TYPE, QueryParamsMedium} from "podverse-helpers";
  import { cookies } from 'next/headers';
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { ClipsClient } from "./ClipsClient";
import { EpisodesDropdownConfigCurrentParams, getEpisodesFilterParams } from "../episodes/EpisodesDropdownConfig";
import { guardSubscribedSsrFilter, safeSsrListRequest } from "../../utils/filters/ssrFilterGuards";
import { getParsedLocalSettings, ClipsFilterDefaults } from '../../utils/localSettings/localSettings';

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_SUBSCRIBED_TYPE).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
  category: z.enum(CATEGORY_MAPPING_KEYS as [string, ...string[]]).optional().nullable().default(null),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type ClipsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ClipsPage({ searchParams }: ClipsPageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrFilterDefaults = ssrLocalSettings.fd?.clips;

  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentCategory, currentPage } =
    await parseSearchParams(queryParams, isValidAuthSession, ssrFilterDefaults);
  

  const medium: QueryParamsMedium = "av";

  let response: ApiListResponse<DTOClip> = await safeSsrListRequest(
    () =>
      ssrApiRequestService.reqClipGetManyPublic({
        page: currentPage,
        medium,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: currentCategory
      }),
    currentPage
  );

  const ssrClips = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);

  return (
    <ClipsClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: currentCategory,
        medium
      }}
      ssrClips={ssrClips}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

function parseSearchParams(
  queryParams: SearchParams,
  isAuthenticated: boolean,
  cookieDefaults?: ClipsFilterDefaults
): EpisodesDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    const guarded = guardSubscribedSsrFilter({
      isAuthenticated,
      type: cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
      sort: cookieDefaults?.sort ?? "recent",
      range: cookieDefaults?.range ?? null,
      category: cookieDefaults?.category ?? null,
      page: 1,
      fallback: {
        type: "global",
        sort: "recent",
        range: null,
        category: null,
        page: 1
      }
    });

    return {
      currentType: guarded.type ?? "global",
      currentSort: guarded.sort ?? "recent",
      currentRange: guarded.range,
      currentCategory: guarded.category,
      currentPage: guarded.page
    };
  }

  const data = parsed.data;

  const guarded = guardSubscribedSsrFilter({
    isAuthenticated,
    type: data.type ?? cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
    sort: data.sort ?? cookieDefaults?.sort ?? "recent",
    range: data.range ?? cookieDefaults?.range ?? null,
    category: data.category ?? cookieDefaults?.category ?? null,
    page: data.page,
    fallback: {
      type: "global",
      sort: "recent",
      range: null,
      category: null,
      page: 1
    }
  });

  return getEpisodesFilterParams({
    page: guarded.page,
    type: guarded.type ?? "global",
    sort: guarded.sort ?? "recent",
    range: guarded.range,
    category: guarded.category
  }, isAuthenticated);
}
