import { 
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_ITEM_TYPE_VALUES,
  QUERY_PARAMS_ITEM_SORT_VALUES
} from "podverse-helpers";
import { z } from "zod";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { EpisodeClient } from "./EpisodeClient";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  type: z.enum(QUERY_PARAMS_ITEM_TYPE_VALUES).optional(),
  sort: z.enum(QUERY_PARAMS_ITEM_SORT_VALUES).optional(),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type EpisodePageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ item_id: string }>;
};

export default async function EpisodePage({ params, searchParams }: EpisodePageProps) {
  const { item_id } = await params;
  const queryParams = searchParams ? await searchParams : {};
  
  const { apiRequestService } = await getSSRAuthService();
    
  const { page = 1, sort, type, range } = await parseSearchParams(queryParams);

  const ssrItem = await apiRequestService.reqItemGetByIdOrIdText(item_id);
  const ssrChannel = await apiRequestService.reqChannelGetByIdOrIdText(ssrItem.channel_id);

  const ssrHasChapters = !!ssrItem.item_chapters_feed
  const ssrHasSoundbites = !!ssrItem.item_soundbites && ssrItem.item_soundbites.length > 0;
  const ssrHasTranscripts = ssrItem.item_transcripts
    && ssrItem.item_transcripts.length > 0;

  console.log('ssrItem.item_soundbites', ssrItem.item_soundbites);

  return (
    <EpisodeClient
      initialQueryParams={{ page, type, sort, range }}
      ssrChannel={ssrChannel}
      ssrItem={ssrItem}
      ssrHasChapters={ssrHasChapters}
      ssrHasSoundbites={ssrHasSoundbites}
      ssrHasTranscripts={ssrHasTranscripts}
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
    data.type = "summary";
    data.sort = "recent";
    data.range = "all-time";
  }
  return data;
}
