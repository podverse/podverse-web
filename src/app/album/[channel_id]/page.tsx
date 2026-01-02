import { 
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_CHANNEL_MUSIC_ALBUM_TYPE_VALUES,
  QUERY_PARAMS_CHANNEL_MUSIC_ALBUM_SORT_VALUES,
  DTOItem,
  ApiListResponse,
  getTotalPages,
} from "podverse-helpers";
import { z } from "zod";
import { getAlbumFilterParams, AlbumDropdownConfigCurrentParams } from "./AlbumDropdownConfig";
import { AlbumClient } from "./AlbumClient";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_CHANNEL_MUSIC_ALBUM_TYPE_VALUES).optional().default("tracks"),
  sort: z.enum(QUERY_PARAMS_CHANNEL_MUSIC_ALBUM_SORT_VALUES).optional().default("forward"),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type AlbumPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ channel_id: string }>;
};

export default async function AlbumPage({ params, searchParams }: AlbumPageProps) {
  const { channel_id } = await params;
  const queryParams = await searchParams;
  
  const { ssrApiRequestService } = await getSSRAuthService();
    
  const { currentPage, currentType, currentSort, currentRange } = await parseSearchParams(queryParams);

  const ssrChannel = await ssrApiRequestService.reqChannelGetByIdOrIdText(channel_id);
  
  let ssrItems: DTOItem[] = [];
  let ssrTotalPages = 1;

  const ssrItemsWithLiveItem = await ssrApiRequestService.reqLiveItemGetManyByChannel(ssrChannel.id_text);
  
  const responseItems = await ssrApiRequestService.reqItemGetManyByChannelBySeason({
    idOrIdText: ssrChannel.id_text,
    page: currentPage,
    sort: currentSort,
    range: currentRange
  });

  ssrItems = [...ssrItemsWithLiveItem, ...responseItems.data];
  ssrTotalPages = getCurrentTotalPages({ currentType, responseItems, currentPage });

  let ssrPodroll = null;
  if ((ssrChannel?.channel_podroll?.channel_podroll_remote_items?.length ?? 0) > 0) {
    ssrPodroll = await ssrApiRequestService.reqPodrollGetForChannel(ssrChannel.id_text);
  }

  return (
    <AlbumClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange
      }}
      ssrChannel={ssrChannel}
      ssrItemsWithLiveItem={ssrItemsWithLiveItem}
      ssrItems={ssrItems}
      ssrTotalPages={ssrTotalPages}
      ssrPodroll={ssrPodroll}
    />
  );
}

type GetAlbumCurrentTotalPages = {
  currentType?: string;
  responseItems?: ApiListResponse<DTOItem>;
  currentPage: number;
};

const getCurrentTotalPages = ({ currentType, responseItems, currentPage }: GetAlbumCurrentTotalPages) => {
  if (currentType === "tracks" && responseItems) {
    return getTotalPages(
      responseItems.meta.count,
      responseItems.meta.limit,
      responseItems.data.length,
      currentPage
    );
  }

  return 1;
}

function parseSearchParams(queryParams: SearchParams): AlbumDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentType: "tracks",
      currentSort: "forward",
      currentRange: null,
      currentPage: 1
    };
  }

  const data = parsed.data;

  return getAlbumFilterParams(data);
}
