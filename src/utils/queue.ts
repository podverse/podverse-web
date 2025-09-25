import { DTOQueue } from "podverse-helpers";

export const getQueueForMedium = (queues: DTOQueue[], medium_id: number) => {
  return queues.find(q => q.medium_id === medium_id) ?? null;
}
