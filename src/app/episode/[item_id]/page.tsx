import { 
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_ITEM_TYPE_VALUES,
  QUERY_PARAMS_ITEM_SORT_VALUES
} from "podverse-helpers";
import { z } from "zod";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { EpisodeClient } from "./EpisodeClient";
import { EpisodeDropdownConfigCurrentParams, getEpisodeFilterParams } from "./EpisodeDropdownConfig";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_ITEM_TYPE_VALUES).optional().default("summary"),
  sort: z.enum(QUERY_PARAMS_ITEM_SORT_VALUES).optional().default("recent"),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null)
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export type EpisodePageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ item_id: string }>;
};

export default async function EpisodePage({ params, searchParams }: EpisodePageProps) {
  const { item_id } = await params;
  const queryParams = await searchParams;
  
  const { apiRequestService } = await getSSRAuthService();
    
  const { currentPage, currentType, currentSort, currentRange } = parseSearchParams(queryParams);

  const ssrItem = await apiRequestService.reqItemGetByIdOrIdText(item_id);
  const ssrChannel = await apiRequestService.reqChannelGetByIdOrIdText(ssrItem.channel_id);

  const ssrHasChapters = !!ssrItem.item_chapters_feed
  const ssrHasSoundbites = !!ssrItem.item_soundbites && ssrItem.item_soundbites.length > 0;
  const ssrHasTranscripts = ssrItem.item_transcripts
    && ssrItem.item_transcripts.length > 0;

  return (
    <EpisodeClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange
      }}
      ssrChannel={ssrChannel}
      ssrItem={ssrItem}
      ssrHasChapters={ssrHasChapters}
      ssrHasSoundbites={ssrHasSoundbites}
      ssrHasTranscripts={ssrHasTranscripts}
    />
  );
}

function parseSearchParams(searchParams: SearchParams): EpisodeDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(searchParams);

  if (!parsed.success) {
    return {
      currentType: "summary",
      currentSort: "recent",
      currentRange: null,
      currentPage: 1
    };
  }

  const data = parsed.data;

  return getEpisodeFilterParams(data);
}
