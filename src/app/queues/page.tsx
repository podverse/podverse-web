import { DTOQueue } from "podverse-helpers";
import { z } from "zod";
import { QueuesClient } from "./QueuesClient";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";

const searchParamsSchema = z.object({
  medium_id: z.string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v), { message: "medium_id must be a number" })
    .optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type QueuePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function QueuePage({ searchParams }: QueuePageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
    
  const queryParams = searchParams ? await searchParams : {};
  const { medium_id } = await parseSearchParams(queryParams);

  let ssrQueues: DTOQueue[] = [];

  if (isValidAuthSession) {
    const response = await apiRequestService.reqQueueGetAllForAccountPrivate();
    ssrQueues = response;
  }

  return (
    <QueuesClient
      initialQueryParams={{ medium_id }}
      ssrQueues={ssrQueues}
    />
  );
}

async function parseSearchParams(queryParams: SearchParams) {
  const parsed = searchParamsSchema.safeParse(queryParams);
  if (!parsed.success) {
    return {};
  }
  const data = parsed.data;

  return data;
}
