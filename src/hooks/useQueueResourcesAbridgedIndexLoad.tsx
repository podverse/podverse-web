import { useCallback } from "react";
import { apiRequestService } from "../factories/apiRequestService";
import { generateQueueResourceAbridgedIndex } from "podverse-helpers/src/lib/queue/queueResourceAbridged";
import { useQueueResourcesAbridgedIndex } from "../contexts/QueueResourcesAbridgedIndex";
import { useAccount } from "../contexts/Account";

export function useQueueResourcesAbridgedLoad() {
  const { setQueueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();
  const { loggedInAccount } = useAccount();

  return useCallback(async () => {
    if (!loggedInAccount) {
      return;
    }

    const resources = await apiRequestService.reqQueueResourcesGetAllByAccountAbridged();
    const index = generateQueueResourceAbridgedIndex(resources);
    setQueueResourcesAbridgedIndex(index);
  }, []);
}
