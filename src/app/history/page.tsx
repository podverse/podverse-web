import { DTOQueue, QUERY_PARAMS_QUEUE_MEDIUMS, QueryParamsQueueMedium } from "podverse-helpers";
import { z } from "zod";
import { HistoryClient } from "./HistoryClient";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  medium: z.enum(QUERY_PARAMS_QUEUE_MEDIUMS).optional().default("av"),
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type HistoryPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();
    
  const queryParams = await searchParams;
  const { currentMedium, currentPage } = parseSearchParams(queryParams);

  let ssrQueues: DTOQueue[] = [];

  if (isValidAuthSession) {
    const response = await ssrApiRequestService.reqQueueGetAllForAccountPrivate();
    ssrQueues = response;
  }

  return (
    <HistoryClient
      initialQueryParams={{ medium: currentMedium, page: currentPage }}
      ssrQueues={ssrQueues}
    />
  );
}

type ParseSearchParams = {
  currentMedium: QueryParamsQueueMedium;
  currentPage: number;
}

function parseSearchParams(queryParams: SearchParams): ParseSearchParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentMedium: "av",
      currentPage: 1
    };
  }

  const data = parsed.data;

  return { currentMedium: data.medium, currentPage: data.page }
}
