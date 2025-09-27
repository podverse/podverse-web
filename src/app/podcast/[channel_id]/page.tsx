import { 
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_CHANNEL_TYPE_VALUES,
  QUERY_PARAMS_CHANNEL_SORT_VALUES,
  DTOItem,
  DTOClip,
  DTOLiveItem,
  ApiListResponse,
  getTotalPages
} from "podverse-helpers";
import { z } from "zod";
import { getPodcastFilterParams } from "./PodcastDropdownConfig";
import { PodcastClient } from "./PodcastClient";
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
  const { currentType, currentSort, currentRange } = getPodcastFilterParams({ type, sort, range });

  const ssrChannel = await apiRequestService.reqChannelGetByIdOrIdText(channel_id);
  
  const responseItems = await apiRequestService.reqItemGetManyWithoutLiveItemByChannel(ssrChannel.id_text, {
    page,
    sort: currentSort,
    range: currentRange
  });
  const ssrItems = responseItems.data;
 
  const ssrLiveItems: DTOLiveItem[] = [];
  const ssrClips: DTOClip[] = [];

  const ssrTotalPages = getCurrentTotalPages({ currentType, responseItems });

  let ssrPodroll = null;
  if ((ssrChannel?.channel_podroll?.channel_podroll_remote_items?.length ?? 0) > 0) {
    ssrPodroll = await apiRequestService.reqPodrollGetForChannel(ssrChannel.id_text);
  }

  return (
    <PodcastClient
      initialQueryParams={{ page, type, sort, range }}
      ssrChannel={ssrChannel}
      ssrLiveItems={ssrLiveItems}
      ssrItems={ssrItems}
      ssrClips={ssrClips}
      ssrTotalPages={ssrTotalPages}
      ssrPodroll={ssrPodroll}
    />
  );
}

type GetPodcastCurrentTotalPages = {
  currentType?: string;
  responseItems: ApiListResponse<DTOItem>;
  responseClips?: ApiListResponse<DTOClip>;
};

const getCurrentTotalPages = ({ currentType, responseItems, responseClips }: GetPodcastCurrentTotalPages) => {
  if (currentType === "clips" && responseClips) {
    return getTotalPages(responseClips.meta.count, responseClips.meta.limit);
  }
  return getTotalPages(responseItems.meta.count, responseItems.meta.limit);
}

async function parseSearchParams(searchParams: SearchParams) {
  const parsed = searchParamsSchema.safeParse(searchParams);
  if (!parsed.success) {
    return {};
  }
  const data = parsed.data;

  if (!data.type) {
    data.type = "episodes";
    data.sort = "recent";
    data.range = undefined;
  }
  return data;
}
