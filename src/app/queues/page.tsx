import { DTOQueue, QUERY_PARAMS_MEDIUMS, QueryParamsMedium } from "podverse-helpers";
import { z } from "zod";
import { QueuesClient } from "./QueuesClient";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  medium: z.enum(QUERY_PARAMS_MEDIUMS).optional().default("all"),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type QueuePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function QueuePage({ searchParams }: QueuePageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
    
  const queryParams = await searchParams;
  const { currentMedium } = await parseSearchParams(queryParams);

  let ssrQueues: DTOQueue[] = [];

  if (isValidAuthSession) {
    const response = await apiRequestService.reqQueueGetAllForAccountPrivate();
    ssrQueues = response;
  }

  return (
    <QueuesClient
      initialQueryParams={{ medium: currentMedium }}
      ssrQueues={ssrQueues}
    />
  );
}

type ParseSearchParams = {
  currentMedium: QueryParamsMedium;
}

function parseSearchParams(queryParams: SearchParams): ParseSearchParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentMedium: "all"
    };
  }

  const data = parsed.data;

  return { currentMedium: data.medium }
}
