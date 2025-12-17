import {
  CATEGORY_MAPPING_KEYS,
  QUERY_PARAMS_STATS_RANGE_VALUES,
  getTotalPages, 
  QueryParamsMedium,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  ApiListResponse,
  DTOChannel,
  QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE
} from "podverse-helpers";
import { z } from "zod";
import { AlbumsClient } from "./AlbumsClient";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { AlbumsDropdownConfigCurrentParams, getAlbumsFilterParams } from "./AlbumsDropdownConfig";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_FULL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
  category: z.enum(CATEGORY_MAPPING_KEYS as [string, ...string[]]).optional().nullable().default(null),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type AlbumsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function AlbumsPage({ searchParams }: AlbumsPageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
    
  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentPage } =
    await parseSearchParams(queryParams, isValidAuthSession);
  
  const medium: QueryParamsMedium = "music";
  const response: ApiListResponse<DTOChannel> = await apiRequestService.reqChannelGetMany({
    page: currentPage,
    medium,
    type: currentType,
    sort: currentSort,
    range: currentRange,
    category: null
  });

  const ssrChannels = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);
  
  return (
    <AlbumsClient
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

function parseSearchParams(queryParams: SearchParams,
  isAuthenticated: boolean): AlbumsDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentType: isAuthenticated ? "subscribed" : "global",
      currentSort: "recent",
      currentRange: null,
      currentPage: 1
    };
  }

  const data = parsed.data;

  return getAlbumsFilterParams(data, isAuthenticated);
}
