import { 
  QUERY_PARAMS_CHANNEL_MUSIC_ARTIST_TYPE_VALUES
} from "podverse-helpers";
import { z } from "zod";
import { getArtistFilterParams, ArtistDropdownConfigCurrentParams } from "./ArtistDropdownConfig";
import { ArtistClient } from "./ArtistClient";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  type: z.enum(QUERY_PARAMS_CHANNEL_MUSIC_ARTIST_TYPE_VALUES).optional().default("albums"),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type ArtistPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ channel_id: string }>;
};

export default async function ArtistPage({ params, searchParams }: ArtistPageProps) {
  const { channel_id } = await params;
  const queryParams = await searchParams;
  
  const { ssrApiRequestService } = await getSSRAuthService();
    
  const { currentType } = await parseSearchParams(queryParams);

  const response = await ssrApiRequestService.reqPublisherFeedGetRemoteItemsForChannel(channel_id);

  let ssrPodroll = null;
  if ((response.channel?.channel_podroll?.channel_podroll_remote_items?.length ?? 0) > 0) {
    ssrPodroll = await ssrApiRequestService.reqPodrollGetForChannel(response.channel.id_text);
  }

  return (
    <ArtistClient
      initialQueryParams={{
        type: currentType,
      }}
      ssrChannel={response.channel}
      ssrChannelsAdded={response.channelsAdded}
      ssrChannelsUnadded={response.channelsUnadded}
      ssrItemsAdded={response.itemsAdded}
      ssrItemsUnadded={response.itemsUnadded}
      ssrPodroll={ssrPodroll}
    />
  );
}

function parseSearchParams(queryParams: SearchParams): ArtistDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentType: "albums"
    };
  }

  const data = parsed.data;

  return getArtistFilterParams(data);
}
