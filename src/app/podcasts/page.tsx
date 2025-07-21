import { CATEGORY_MAPPING_KEYS, QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_CHANNELS_SORT_VALUES,
  QUERY_PARAMS_CHANNELS_TYPE_VALUES, getTotalPages, 
  QueryParamsChannelsType,
  QueryParamsChannelsSort,
  QueryParamsStatsRange} from "podverse-helpers";
import { z } from "zod";
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

  const { typeMenuItems, sortMenuItems, rangeMenuItems, currentSort, currentRange,
    showRangeDropdown } = getDropdownConfig(type, sort, range);

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
      dropdownConfig={{ typeMenuItems, sortMenuItems, rangeMenuItems, showRangeDropdown }}
    />
  );
}

async function parseSearchParams(params: PodcastPageProps, isAuthenticated: boolean) {
  const parsed = searchParamsSchema.safeParse(params);
  if (!parsed.success) {
    console.warn("Invalid search parameters:", parsed.error);
    return {};
  }
  const data = parsed.data;
  if (!data.type) {
    data.type = isAuthenticated ? "subscribed" : "all";
  }
  return data;
}

const typeDropdownMenuItems = [
  { label: "All", param: "type", value: "all" },
  { label: "Subscribed", param: "type", value: "subscribed" },
  { label: "Category", param: "type", value: "category" }
];

const sortDropdownMenuItems = [
  { label: "Recent", param: "sort", value: "recent" },
  { label: "Oldest", param: "sort", value: "oldest" },
  { label: "A - Z", param: "sort", value: "alphabetical" },
  { label: "Top", param: "sort", value: "top" },
];

const rangeDropdownMenuItems = [
  { label: "Day", param: "range", value: "day" },
  { label: "Week", param: "range", value: "week" },
  { label: "Month", param: "range", value: "month" },
  { label: "All Time", param: "range", value: "all-time" },
];

function getDropdownConfig(type?: QueryParamsChannelsType, sort?: QueryParamsChannelsSort, range?: QueryParamsStatsRange) {
  let currentSort = sort;
  let currentRange = range;
  let showRangeDropdown = false;

  let typeMenuItems = typeDropdownMenuItems;
  let sortMenuItems = sortDropdownMenuItems;
  let rangeMenuItems = rangeDropdownMenuItems;

  if (type === "all" || type === "category") {
    sortMenuItems = [{ label: "Top", param: "sort", value: "top" }];
    currentSort = "top";
    currentRange = currentRange || "day";
  } else if (type === "subscribed") {
    sortMenuItems = sortDropdownMenuItems;
    currentSort = currentSort || "alphabetical";
  }

  if (currentSort !== "top") {
    showRangeDropdown = false;
    rangeMenuItems = [];
  } else {
    showRangeDropdown = true;
  }

  return { typeMenuItems, sortMenuItems, rangeMenuItems, currentSort, currentRange, showRangeDropdown };
}
