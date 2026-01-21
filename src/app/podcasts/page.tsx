import {
  CATEGORY_MAPPING_KEYS,
  QUERY_PARAMS_STATS_RANGE_VALUES,
  getTotalPages, 
  QueryParamsMedium,
  QUERY_PARAMS_SUBSCRIBED_TYPE,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  ApiListResponse,
  DTOChannel
} from "podverse-helpers";
import { cookies } from 'next/headers';
import { z } from "zod";
import { PodcastsClient } from "./PodcastsClient";
import { getPodcastsFilterParams, PodcastsDropdownConfigCurrentParams } from "./PodcastsDropdownConfig";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { guardSubscribedSsrFilter, safeSsrListRequest } from "../../utils/filters/ssrFilterGuards";
import { getParsedLocalSettings, PodcastsFilterDefaults } from '../../utils/localSettings/localSettings';

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_SUBSCRIBED_TYPE).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_FULL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
  category: z.enum(CATEGORY_MAPPING_KEYS as [string, ...string[]]).optional().nullable().default(null),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type PodcastsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PodcastsPage({ searchParams }: PodcastsPageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrFilterDefaults = ssrLocalSettings.fd?.podcasts;

  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentCategory, currentPage } =
    await parseSearchParams(queryParams, isValidAuthSession, ssrFilterDefaults);
  
  const medium: QueryParamsMedium = "av";
  const response: ApiListResponse<DTOChannel> = await safeSsrListRequest(
    () =>
    ssrApiRequestService.reqChannelGetMany({
      page: currentPage,
      medium,
      type: currentType,
      sort: currentSort,
      range: currentRange,
      category: currentCategory
    }),
    currentPage
  );

  const ssrChannels = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);
  
  return (
    <PodcastsClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: currentCategory,
        medium
      }}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

function parseSearchParams(
  queryParams: SearchParams,
  isAuthenticated: boolean,
  cookieDefaults?: PodcastsFilterDefaults
): PodcastsDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    const guarded = guardSubscribedSsrFilter({
      isAuthenticated,
      type: cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
      sort: cookieDefaults?.sort ?? (isAuthenticated ? "a_z" : "recent"),
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
    sort: data.sort ?? cookieDefaults?.sort ?? (isAuthenticated ? "a_z" : "recent"),
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

  return getPodcastsFilterParams({
    page: guarded.page,
    type: guarded.type ?? "global",
    sort: guarded.sort ?? "recent",
    range: guarded.range,
    category: guarded.category
  }, isAuthenticated);
}
