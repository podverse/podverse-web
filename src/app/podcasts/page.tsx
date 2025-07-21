import { CATEGORY_MAPPING_KEYS, QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_CHANNELS_SORT_VALUES,
  QUERY_PARAMS_CHANNELS_TYPE_VALUES, getTotalPages } from "podverse-helpers";
import { z } from "zod";
import { getChannelQueryParams } from "./PodcastsDropdownConfig";
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
    
  const params = searchParams ? await searchParams : {};
  const { page = 1, sort, type, range, category } = await parseSearchParams(params, isValidAuthSession);
  
  const { currentType, currentSort, currentRange } = getChannelQueryParams({ type, sort, range, category });

  
  const response = await apiRequestService.reqChannelGetMany({
    page,
    sort: currentSort,
    type: currentType,
    range: currentRange,
    category
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

  if (data.category) {
    data.type = "category";
    data.sort = "top";
    data.range = "day";
  } else if (!data.type) {
    data.type = isAuthenticated ? "subscribed" : "all";
    data.sort = isAuthenticated ? "alphabetical" : "top";
    data.range = "day";
  }
  return data;
}
