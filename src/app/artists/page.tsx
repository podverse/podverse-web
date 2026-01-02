import {
  QUERY_PARAMS_STATS_RANGE_VALUES,
  getTotalPages, 
  QueryParamsMedium,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  ApiListResponse,
  DTOChannel,
  QUERY_PARAMS_SUBSCRIBED_MUSIC_TYPE
} from "podverse-helpers";
import { z } from "zod";
import { ArtistsClient } from "./ArtistsClient";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { ArtistsDropdownConfigCurrentParams, getArtistsFilterParams } from "./ArtistsDropdownConfig";

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
    
  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentPage } =
    await parseSearchParams(queryParams, isValidAuthSession);
  
  const medium: QueryParamsMedium = "publisher-music";
  const response: ApiListResponse<DTOChannel> = await ssrApiRequestService.reqChannelGetMany({
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

function parseSearchParams(queryParams: SearchParams,
  isAuthenticated: boolean): ArtistsDropdownConfigCurrentParams {
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

  return getArtistsFilterParams(data, isAuthenticated);
}
