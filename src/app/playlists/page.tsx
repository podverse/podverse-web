import { QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_PLAYLISTS_TYPE_VALUES,
  QUERY_PARAMS_PLAYLISTS_SORT_VALUES, getTotalPages, 
  DTOPlaylist} from "podverse-helpers";
import { z } from "zod";
import { PlaylistsClient } from "./PlaylistsClient";
import { getPlaylistsFilterParams } from "./PlaylistsDropdownConfig";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  type: z.enum(QUERY_PARAMS_PLAYLISTS_TYPE_VALUES).optional(),
  sort: z.enum(QUERY_PARAMS_PLAYLISTS_SORT_VALUES).optional(),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional()
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type PlaylistsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PlaylistsPage({ searchParams }: PlaylistsPageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
    
  const queryParams = searchParams ? await searchParams : {};
  const { page = 1, sort, type, range } = await parseSearchParams(queryParams, isValidAuthSession);
  const { currentType, currentSort, currentRange } = getPlaylistsFilterParams({ type, sort, range });

  let ssrPlaylists: DTOPlaylist[] = [];
  let ssrTotalPages = 0;
  if (currentType === "global") {
    const response = await apiRequestService.reqPlaylistGetManyPublic({
      page,
      sort: currentSort,
      range: currentRange
    });
    ssrPlaylists = response.data;
    ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit);
  }

  return (
    <PlaylistsClient
      initialQueryParams={{ page, type, sort, range }}
      ssrPlaylists={ssrPlaylists}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

async function parseSearchParams(queryParams: SearchParams, isAuthenticated: boolean) {
  const parsed = searchParamsSchema.safeParse(queryParams);
  if (!parsed.success) {
    return {};
  }
  const data = parsed.data;

  if (!data.type) {
    data.type = isAuthenticated ? "global" : "global";
    data.sort = isAuthenticated ? "top" : "top";
    data.range = "week";
  }
  return data;
}
