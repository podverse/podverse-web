import { CATEGORY_MAPPING_KEYS, QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_CHANNELS_SORT_VALUES,
  QUERY_PARAMS_CHANNELS_TYPE_VALUES, getTotalPages, QueryParamsChannelsType,
  QueryParamsChannelsSort, QueryParamsStatsRange } from "podverse-helpers";
import { z } from "zod";
import { getCurrentSortAndRange } from "./PodcastsDropdownConfig";
import PodcastsClient from "./PodcastsClient";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  type: z.enum(QUERY_PARAMS_CHANNELS_TYPE_VALUES).optional(),
  sort: z.enum(QUERY_PARAMS_CHANNELS_SORT_VALUES).optional(),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional(),
  category: z.enum(CATEGORY_MAPPING_KEYS as [string, ...string[]]).optional(),
});

export type PodcastPageProps = z.infer<typeof searchParamsSchema>;

export default async function Podcasts({ searchParams }: { searchParams?: Promise<PodcastPageProps> }) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
  
  const defaultValueType: QueryParamsChannelsType = isValidAuthSession ? "subscribed" : "all";
  const defaultValueSort: QueryParamsChannelsSort = isValidAuthSession ? "alphabetical" : "top";
  const defaultValueRange: QueryParamsStatsRange = "day";
  
  const params = searchParams ? await searchParams : {};
  const { page = 1, sort = defaultValueSort, type = defaultValueType, range = defaultValueRange,
    category } = await parseSearchParams(params, isValidAuthSession);
  
  const { currentSort, currentRange } = getCurrentSortAndRange({ type, sort, range });

  const response = await apiRequestService.reqChannelGetMany({
    page,
    sort: currentSort,
    type,
    range: currentRange
  });
  
  const ssrChannels = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit);

  return (
    <PodcastsClient
      initialQueryParams={{ page, type, sort, range, category }}
      ssrChannels={ssrChannels}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

async function parseSearchParams(params: PodcastPageProps, isAuthenticated: boolean) {
  const parsed = searchParamsSchema.safeParse(params);
  if (!parsed.success) {
    return {};
  }
  const data = parsed.data;
  if (!data.type) {
    data.type = isAuthenticated ? "subscribed" : "all";
  }
  return data;
}
