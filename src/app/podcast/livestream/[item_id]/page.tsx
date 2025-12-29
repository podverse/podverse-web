import { QUERY_PARAMS_LIVE_ITEM_TYPE_VALUES } from "podverse-helpers";
import { z } from "zod";
import { getSSRAuthService } from "../../../../utils/auth/ssrAuth";
import { getLivestreamFilterParams, LivestreamDropdownConfigCurrentParams } from "./LivestreamDropdownConfig";
import { LivestreamClient } from "./LivestreamClient";

const searchParamsSchema = z.object({
  type: z.enum(QUERY_PARAMS_LIVE_ITEM_TYPE_VALUES).optional().default("summary")
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type LivestreamPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ item_id: string }>;
};

export default async function PodcastLivestreamPage({ params, searchParams }: LivestreamPageProps) {
  const { item_id } = await params;
  const queryParams = await searchParams;
  
  const { ssrApiRequestService } = await getSSRAuthService();
    
  const { currentType } = parseSearchParams(queryParams);

  const ssrItem = await ssrApiRequestService.reqItemGetByIdOrIdText(item_id);
  const ssrChannel = await ssrApiRequestService.reqChannelGetByIdOrIdText(ssrItem.channel_id);

  return (
    <LivestreamClient
      initialQueryParams={{
        type: currentType
      }}
      ssrChannel={ssrChannel}
      ssrItem={ssrItem}
      medium="av"
    />
  );
}

function parseSearchParams(searchParams: SearchParams): LivestreamDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(searchParams);

  if (!parsed.success) {
    return {
      currentType: "summary"
    };
  }

  const data = parsed.data;

  return getLivestreamFilterParams(data);
}
