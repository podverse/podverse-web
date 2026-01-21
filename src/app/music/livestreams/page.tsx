import React from "react";
import z from "zod";
import { cookies } from 'next/headers';
import { ApiListResponse, DTOItem, getTotalPages,
  LIVE_ITEM_STATUSES,
  QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE, QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT,
  QueryParamsMedium} from "podverse-helpers";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { LivestreamsClient } from "../../podcasts/livestreams/LivestreamsClient";
import { getLivestreamsFilterParams, LivestreamsDropdownConfigCurrentParams } from "../../podcasts/livestreams/LivestreamsDropdownConfig";
import { guardSubscribedSsrFilter, safeSsrListRequest } from "../../../utils/filters/ssrFilterGuards";
import { getParsedLocalSettings, MusicLivestreamsFilterDefaults } from '../../../utils/localSettings/localSettings';

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
  category: z.nullable(z.string()).optional().default(null),
  liveItemType: z.enum(LIVE_ITEM_STATUSES).optional().nullable().default(null),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type MusicLivestreamsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function MusicLivestreamsPage({ searchParams }: MusicLivestreamsPageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrFilterDefaults = ssrLocalSettings.fd?.['music-livestreams'];
    
  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentPage, currentLiveItemType } =
    await parseSearchParams(queryParams, isValidAuthSession, ssrFilterDefaults);
  
  const medium: QueryParamsMedium = "music";
  let response: ApiListResponse<DTOItem> = await safeSsrListRequest(
    () =>
      ssrApiRequestService.reqLiveItemGetMany(
        {
          page: currentPage,
          medium,
          type: currentType,
          sort: currentSort,
          range: currentRange,
          category: null
        },
        currentLiveItemType
      ),
    currentPage
  );

  const ssrItems = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);
  
  return (
    <LivestreamsClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: null,
        medium,
        liveItemType: currentLiveItemType
      }}
      ssrItems={ssrItems}
      ssrTotalPages={ssrTotalPages}
      medium={medium}
    />
  );
}

function parseSearchParams(
  queryParams: SearchParams,
  isAuthenticated: boolean,
  cookieDefaults?: MusicLivestreamsFilterDefaults
): LivestreamsDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    const guarded = guardSubscribedSsrFilter({
      isAuthenticated,
      type: cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
      sort: cookieDefaults?.sort ?? "recent",
      range: cookieDefaults?.range ?? null,
      category: null,
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
      currentPage: guarded.page,
      currentLiveItemType: cookieDefaults?.liveItemType ?? "live"
    };
  }

  const data = parsed.data;

  const guarded = guardSubscribedSsrFilter({
    isAuthenticated,
    type: data.type ?? cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
    sort: data.sort ?? cookieDefaults?.sort ?? "recent",
    range: data.range ?? cookieDefaults?.range ?? null,
    category: null,
    page: data.page,
    fallback: {
      type: "global",
      sort: "recent",
      range: null,
      category: null,
      page: 1
    }
  });

  return getLivestreamsFilterParams({
    page: guarded.page,
    type: guarded.type ?? "global",
    sort: guarded.sort ?? "recent",
    range: guarded.range,
    category: null,
    liveItemType: data.liveItemType ?? cookieDefaults?.liveItemType ?? "live"
  }, isAuthenticated);
}

