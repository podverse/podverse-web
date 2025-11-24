import { CATEGORY_MAPPING_KEYS, QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_CHANNELS_SORT_VALUES,
  QUERY_PARAMS_CHANNELS_TYPE_VALUES, getTotalPages, 
  QueryParamsMedium} from "podverse-helpers";
import { z } from "zod";
import { PodcastsClient } from "./PodcastsClient";
import { getPodcastsFilterParams } from "./PodcastsDropdownConfig";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  type: z.enum(QUERY_PARAMS_CHANNELS_TYPE_VALUES).optional(),
  sort: z.enum(QUERY_PARAMS_CHANNELS_SORT_VALUES).optional(),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional(),
  category: z.enum(CATEGORY_MAPPING_KEYS as [string, ...string[]]).optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type PodcastsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PodcastsPage({ searchParams }: PodcastsPageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
    
  const queryParams = searchParams ? await searchParams : {};
  const { page = 1, sort, type, range, category } = await parseSearchParams(queryParams, isValidAuthSession);
  const { currentType, currentSort, currentRange } = getPodcastsFilterParams({ type, sort, range, category });
  
  const medium: QueryParamsMedium = "podcasts";

  const response = await apiRequestService.reqChannelGetMany({
    page,
    sort: currentSort,
    type: currentType,
    range: currentRange,
    category,
    medium
  });
  
  const ssrChannels = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit);
  
  return (
    <PodcastsClient
      initialQueryParams={{ page, type, sort, range, category, medium }}
      ssrChannels={ssrChannels}
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

  if (data.category) {
    data.type = "category";
    data.sort = "recent";
  } else if (!data.type) {
    data.type = isAuthenticated ? "subscribed" : "global";
    data.sort = isAuthenticated ? "a_z" : "recent";
  }
  return data;
}
