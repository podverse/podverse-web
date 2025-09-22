import { QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_PLAYLISTS_TYPE_VALUES,
  QUERY_PARAMS_PLAYLISTS_SORT_VALUES, getTotalPages, 
  DTOPlaylist,
  getUndeterminedTotalPages } from "podverse-helpers";
import { z } from "zod";
import { PlaylistsClient } from "./PlaylistsClient";
import { getPlaylistsFilterParams } from "./PlaylistsDropdownConfig";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  type: z.enum(QUERY_PARAMS_PLAYLISTS_TYPE_VALUES).optional(),
  sort: z.enum(QUERY_PARAMS_PLAYLISTS_SORT_VALUES).optional(),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional(),
  medium_id: z.string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v), { message: "medium_id must be a number" })
    .optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type PlaylistsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PlaylistsPage({ searchParams }: PlaylistsPageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
    
  const queryParams = searchParams ? await searchParams : {};
  const { page = 1, sort, type, range, medium_id } = await parseSearchParams(queryParams, isValidAuthSession);
  const { currentType, currentSort, currentRange, currentMediumId } = getPlaylistsFilterParams({ type, sort, range, medium_id });

  let ssrPlaylists: DTOPlaylist[] = [];
  let ssrTotalPages = 0;
  if (currentType === "global") {
    const response = await apiRequestService.reqPlaylistGetManyPublic({
      page,
      sort: currentSort,
      range: currentRange,
      medium_id: currentMediumId
    });
    ssrPlaylists = response.data;
    ssrTotalPages = getUndeterminedTotalPages();
  } else if (currentType === "my_playlists") {
    if (isValidAuthSession) {
      const response = await apiRequestService.reqPlaylistGetManyPrivate({
        page,
        sort: currentSort,
        range: currentRange,
        medium_id: currentMediumId
      });
      ssrPlaylists = response.data;
      ssrTotalPages = getTotalPages(response.meta?.count, response.meta?.limit);
    }
  } else if (currentType === "subscribed") {
    if (isValidAuthSession) {
      const response = await apiRequestService.reqPlaylistGetManyPrivateFollowed({
        page,
        sort: currentSort,
        range: currentRange,
        medium_id: currentMediumId
      });
      ssrPlaylists = response.data;
      ssrTotalPages = getTotalPages(response.meta?.count, response.meta?.limit);
    }
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
    data.type = isAuthenticated ? "my_playlists" : "global";
    data.sort = isAuthenticated ? "a_z" : "top";
    data.range = "week";
  }
  return data;
}
