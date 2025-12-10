import { QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_PLAYLISTS_TYPE_VALUES,
  getTotalPages, DTOPlaylist,
  QueryParamsPlaylistsType, QueryParamsStatsRange,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  QueryParamsSubscribedFullSort,
  QUERY_PARAMS_QUEUE_MEDIUMS,
  QueryParamsQueueMedium
} from "podverse-helpers";
import { z } from "zod";
import { PlaylistsClient } from "./PlaylistsClient";
import { getPlaylistsFilterParams } from "./PlaylistsDropdownConfig";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_PLAYLISTS_TYPE_VALUES).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_FULL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
  medium: z.enum(QUERY_PARAMS_QUEUE_MEDIUMS).optional().default("all")
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type PlaylistsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PlaylistsPage({ searchParams }: PlaylistsPageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
    
  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentMedium,
    currentPage } = await parseSearchParams(queryParams, isValidAuthSession);
  
  const response = await apiRequestService.reqPlaylistGetMany({
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

function parseSearchParams(queryParams: SearchParams, isAuthenticated: boolean): ParseSearchParams  {
  const parsed = searchParamsSchema.safeParse(queryParams);
  
  if (!parsed.success) {
    return {
      currentPage: 1,
      currentType: isAuthenticated ? "private" : "public",
      currentSort: isAuthenticated ? "a_z" : "top",
      currentRange: "week",
      currentMedium: "all"
    };
  }

  const data = parsed.data;

  if (!data.type) {
    data.type = isAuthenticated ? "private" : "public";
    data.sort = isAuthenticated ? "a_z" : "top";
    data.range = isAuthenticated ? null : "week";
  }

  return getPlaylistsFilterParams(data, isAuthenticated);
}
