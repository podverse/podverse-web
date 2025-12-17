import { 
  QUERY_PARAMS_ITEM_MUSIC_TYPE_VALUES
} from "podverse-helpers";
import { z } from "zod";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { TrackClient } from "./TrackClient";
import { getTrackFilterParams, TrackDropdownConfigCurrentParams } from "./TrackDropdownConfig";

const searchParamsSchema = z.object({
  type: z.enum(QUERY_PARAMS_ITEM_MUSIC_TYPE_VALUES).optional().default("summary")
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type TrackPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ item_id: string }>;
};

export default async function TrackPage({ params, searchParams }: TrackPageProps) {
  const { item_id } = await params;
  const queryParams = await searchParams;
  
  const { apiRequestService } = await getSSRAuthService();
    
  const { currentType } = parseSearchParams(queryParams);

  const ssrItem = await apiRequestService.reqItemGetByIdOrIdText(item_id);
  const ssrChannel = await apiRequestService.reqChannelGetByIdOrIdText(ssrItem.channel_id);

  const ssrHasTranscripts = ssrItem.item_transcripts
    && ssrItem.item_transcripts.length > 0;

  return (
    <TrackClient
      initialQueryParams={{
        type: currentType
      }}
      ssrChannel={ssrChannel}
      ssrItem={ssrItem}
      ssrHasTranscripts={ssrHasTranscripts}
    />
  );
}

function parseSearchParams(searchParams: SearchParams): TrackDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(searchParams);

  if (!parsed.success) {
    return {
      currentType: "summary"
    };
  }

  const data = parsed.data;

  return getTrackFilterParams(data);
}
