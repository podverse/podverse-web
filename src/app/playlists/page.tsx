import { QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_PLAYLISTS_TYPE_VALUES,
  getTotalPages, DTOPlaylist,
  QueryParamsPlaylistsType, QueryParamsStatsRange,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  QueryParamsSubscribedFullSort,
  QUERY_PARAMS_QUEUE_MEDIUMS,
  QueryParamsQueueMedium
} from "podverse-helpers";
import { cookies } from 'next/headers';
import { z } from "zod";
import { PlaylistsClient } from "./PlaylistsClient";
import { getPlaylistsFilterParams } from "./PlaylistsDropdownConfig";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { getParsedLocalSettings, PlaylistsFilterDefaults } from '../../utils/localSettings/localSettings';

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_PLAYLISTS_TYPE_VALUES).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_FULL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
  medium: z.enum(QUERY_PARAMS_QUEUE_MEDIUMS).optional().nullable().default(null)
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type PlaylistsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PlaylistsPage({ searchParams }: PlaylistsPageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrFilterDefaults = ssrLocalSettings.fd?.playlists;

  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentMedium,
    currentPage } = await parseSearchParams(queryParams, isValidAuthSession, ssrFilterDefaults);
  
  const response = await ssrApiRequestService.reqPlaylistGetMany({
    page: currentPage,
    type: currentType,
    sort: currentSort,
    range: currentRange,
    medium: currentMedium
  });

  const ssrPlaylists: DTOPlaylist[] = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);

  return (
    <PlaylistsClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        medium: currentMedium
      }}
      ssrPlaylists={ssrPlaylists}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

type ParseSearchParams = {
  currentPage: number;
  currentType: QueryParamsPlaylistsType;
  currentSort: QueryParamsSubscribedFullSort;
  currentRange: QueryParamsStatsRange | null;
  currentMedium: QueryParamsQueueMedium;
}

function parseSearchParams(
  queryParams: SearchParams,
  isAuthenticated: boolean,
  cookieDefaults?: PlaylistsFilterDefaults
): ParseSearchParams  {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentPage: 1,
      currentType: cookieDefaults?.type ?? (isAuthenticated ? "private" : "public"),
      currentSort: cookieDefaults?.sort ?? (isAuthenticated ? "a_z" : "top"),
      currentRange: cookieDefaults?.range ?? (isAuthenticated ? null : "week"),
      currentMedium: cookieDefaults?.medium ?? "av"
    };
  }

  const data = parsed.data;

  return getPlaylistsFilterParams({
    page: data.page,
    type: data.type ?? cookieDefaults?.type ?? (isAuthenticated ? "private" : "public"),
    sort: data.sort ?? cookieDefaults?.sort ?? (isAuthenticated ? "a_z" : "top"),
    range: data.range ?? cookieDefaults?.range ?? (isAuthenticated ? null : "week"),
    medium: data.medium ?? cookieDefaults?.medium ?? "av"
  }, isAuthenticated);
}
