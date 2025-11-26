import { 
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_CHANNEL_TYPE_VALUES,
  QUERY_PARAMS_CHANNEL_SORT_VALUES,
  DTOItem,
  DTOClip,
  ApiListResponse,
  getTotalPages,
  DTOItemSoundbite
} from "podverse-helpers";
import { z } from "zod";
import { getPodcastFilterParams, PodcastDropdownConfigCurrentParams } from "./PodcastDropdownConfig";
import { PodcastClient } from "./PodcastClient";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_CHANNEL_TYPE_VALUES).optional().default("episodes"),
  sort: z.enum(QUERY_PARAMS_CHANNEL_SORT_VALUES).optional().default("recent"),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type PodcastPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ channel_id: string }>;
};

export default async function Podcast({ params, searchParams }: PodcastPageProps) {
  const { channel_id } = await params;
  const queryParams = await searchParams;
  
  const { apiRequestService } = await getSSRAuthService();
    
  const { currentPage, currentType, currentSort, currentRange } = await parseSearchParams(queryParams);

  const ssrChannel = await apiRequestService.reqChannelGetByIdOrIdText(channel_id);
  
  let ssrItems: DTOItem[] = [];
  let ssrClips: DTOClip[] = [];
  let ssrItemSoundbites: DTOItemSoundbite[] = [];
  let ssrHasItemSoundbites = false;
  let ssrTotalPages = 1;

  const responseItemSoundbites = await apiRequestService.reqItemSoundbiteGetManyByChannelIdText(ssrChannel.id_text, {
    page: currentPage,
    sort: currentSort !== "top" ? currentSort : "recent"
  });
  ssrItemSoundbites = responseItemSoundbites.data;
  ssrHasItemSoundbites = responseItemSoundbites.data.length > 0;

  const ssrItemsWithLiveItem = await apiRequestService.reqLiveItemGetManyByChannel(ssrChannel.id_text);
  
  if (currentType === "clips") {
    ssrClips = [];
  } else if (currentType === "soundbites" && currentSort !== "top") {
    ssrTotalPages = getCurrentTotalPages({ currentType, responseItemSoundbites });
  } else {
    const responseItems = await apiRequestService.reqItemGetManyByChannel({
      idOrIdText: ssrChannel.id_text,
      page: currentPage,
      sort: currentSort,
      range: currentRange
    });

    ssrItems = [...ssrItemsWithLiveItem, ...responseItems.data];
    ssrTotalPages = getCurrentTotalPages({ currentType, responseItems });
  }

  let ssrPodroll = null;
  if ((ssrChannel?.channel_podroll?.channel_podroll_remote_items?.length ?? 0) > 0) {
    ssrPodroll = await apiRequestService.reqPodrollGetForChannel(ssrChannel.id_text);
  }

  return (
    <PodcastClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange
      }}
      ssrChannel={ssrChannel}
      ssrItemsWithLiveItem={ssrItemsWithLiveItem}
      ssrItems={ssrItems}
      ssrClips={ssrClips}
      ssrItemSoundbites={ssrItemSoundbites}
      ssrHasItemSoundbites={ssrHasItemSoundbites}
      ssrTotalPages={ssrTotalPages}
      ssrPodroll={ssrPodroll}
    />
  );
}

type GetPodcastCurrentTotalPages = {
  currentType?: string;
  responseItems?: ApiListResponse<DTOItem>;
  responseItemSoundbites?: ApiListResponse<DTOItemSoundbite>;
  responseClips?: ApiListResponse<DTOClip>;
};

const getCurrentTotalPages = ({ currentType, responseItems,
  responseItemSoundbites, responseClips }: GetPodcastCurrentTotalPages) => {
  if (currentType === "soundbites" && responseItemSoundbites) {
    return getTotalPages(
      responseItemSoundbites.meta.count,
      responseItemSoundbites.meta.limit
    );
  } else if (currentType === "clips" && responseClips) {
    return getTotalPages(
      responseClips.meta.count,
      responseClips.meta.limit
    );
  } else if (currentType === "episodes" && responseItems) {
    return getTotalPages(
      responseItems.meta.count,
      responseItems.meta.limit
    );
  }

  return 1;
}

function parseSearchParams(queryParams: SearchParams): PodcastDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentType: "episodes",
      currentSort: "recent",
      currentRange: null,
      currentPage: 1
    };
  }

  const data = parsed.data;

  return getPodcastFilterParams(data);
}
