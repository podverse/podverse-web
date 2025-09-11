import { /* getTotalPages, */ QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_CHANNEL_TYPE_VALUES,
  QUERY_PARAMS_CHANNEL_SORT_VALUES,
  DTOItem,
  DTOClip,
  DTOLiveItem} from "podverse-helpers";
import { z } from "zod";
// import { getPodcastQueryParams } from "./PodcastDropdownConfig";
import PodcastClient from "./PodcastClient";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  type: z.enum(QUERY_PARAMS_CHANNEL_TYPE_VALUES).optional(),
  sort: z.enum(QUERY_PARAMS_CHANNEL_SORT_VALUES).optional(),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type PodcastPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ channel_id: string }>;
};

export default async function Podcast({ params, searchParams }: PodcastPageProps) {
  const { channel_id } = await params;
  const queryParams = searchParams ? await searchParams : {};
  
  const { apiRequestService } = await getSSRAuthService();
    
  const { page = 1, sort, type, range } = await parseSearchParams(queryParams);

  const ssrChannel = await apiRequestService.reqChannelGetByIdOrIdText(channel_id);
  
  // const { currentType, currentSort, currentRange } = getPodcastQueryParams({ type, sort, range });

  const ssrLiveItems: DTOLiveItem[] = [];
  const ssrItems: DTOItem[] = [];
  const ssrClips: DTOClip[] = [];
  const ssrTotalPages = 5;

  return (
    <PodcastClient
      initialQueryParams={{ page, type, sort, range }}
      ssrChannel={ssrChannel}
      ssrLiveItems={ssrLiveItems}
      ssrItems={ssrItems}
      ssrClips={ssrClips}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

async function parseSearchParams(searchParams: SearchParams) {
  const parsed = searchParamsSchema.safeParse(searchParams);
  if (!parsed.success) {
    return {};
  }
  const data = parsed.data;

  if (!data.type) {
    // data.type = isAuthenticated ? "subscribed" : "all";
    // data.sort = isAuthenticated ? "alphabetical" : "top";
    // data.range = "day";
  }
  return data;
}
