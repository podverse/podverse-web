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

  return (
    <EpisodeClient
      initialQueryParams={{ page, type, sort, range }}
      ssrItem={ssrItem}
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
