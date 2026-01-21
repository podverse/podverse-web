import {
  QUERY_PARAMS_STATS_RANGE_VALUES,
  getTotalPages, 
  QueryParamsMedium,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  ApiListResponse,
  DTOChannel,
  QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE
} from "podverse-helpers";
import { cookies } from 'next/headers';
import { z } from "zod";
import { ArtistsClient } from "./ArtistsClient";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { guardSubscribedSsrFilter, safeSsrListRequest } from "../../utils/filters/ssrFilterGuards";
import { ArtistsDropdownConfigCurrentParams, getArtistsFilterParams } from "./ArtistsDropdownConfig";
import { getParsedLocalSettings, ArtistsFilterDefaults } from '../../utils/localSettings/localSettings';

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_FULL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null)
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type ArtistsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrFilterDefaults = ssrLocalSettings.fd?.artists;

  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentPage } =
    await parseSearchParams(queryParams, isValidAuthSession, ssrFilterDefaults);
  
  const medium: QueryParamsMedium = "publisher-music";
  const response: ApiListResponse<DTOChannel> = await safeSsrListRequest(
    () =>
      ssrApiRequestService.reqChannelGetMany({
        page: currentPage,
        medium,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: null
      }),
    currentPage
  );

  const ssrChannels = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);
  
  return (
    <ArtistsClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange,
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
  cookieDefaults?: ArtistsFilterDefaults
): ArtistsDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    const guarded = guardSubscribedSsrFilter({
      isAuthenticated,
      type: cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
      sort: cookieDefaults?.sort ?? "recent",
      range: cookieDefaults?.range ?? null,
      page: 1,
      fallback: {
        type: "global",
        sort: "recent",
        range: null,
        page: 1
      }
    });

    return {
      currentType: guarded.type ?? "global",
      currentSort: guarded.sort ?? "recent",
      currentRange: guarded.range,
      currentPage: guarded.page
    };
  }

  const data = parsed.data;

  const guarded = guardSubscribedSsrFilter({
    isAuthenticated,
    type: data.type ?? cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
    sort: data.sort ?? cookieDefaults?.sort ?? "recent",
    range: data.range ?? cookieDefaults?.range ?? null,
    page: data.page,
    fallback: {
      type: "global",
      sort: "recent",
      range: null,
      page: 1
    }
  });

  return getArtistsFilterParams({
    page: guarded.page,
    type: guarded.type ?? "global",
    sort: guarded.sort ?? "recent",
    range: guarded.range
  }, isAuthenticated);
}
