import { useCallback } from "react";
import { apiRequestService } from "../factories/apiRequestService";
import { generateQueueResourceAbridgedIndex } from "podverse-helpers/src/lib/queue/queueResourceAbridged";
import { useQueueResourcesAbridgedIndex } from "../contexts/QueueResourcesAbridgedIndex";

export function useQueueResourcesAbridgedLoad() {
  const { setQueueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();

  return useCallback(async () => {
    const resources = await apiRequestService.reqQueueResourcesGetAllByAccountAbridged();
    const index = generateQueueResourceAbridgedIndex(resources);
    setQueueResourcesAbridgedIndex(index);
  }, []);
}
