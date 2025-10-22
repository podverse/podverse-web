import { useCallback, useRef, useEffect } from "react";
import { MediumEnum, DTOQueueResource } from "podverse-helpers";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";

export function useQueueResourcesLoadActive() {
  const { loggedInAccount } = useAccount();
  const loggedInAccountRef = useRef(loggedInAccount);

  useEffect(() => {
    loggedInAccountRef.current = loggedInAccount;
  }, [loggedInAccount]);
  
  const { setQueues, setActiveQueue, setActiveQueueUpcomingResources } = useQueues();

  return useCallback(async () => {
    const loggedInAccount = loggedInAccountRef.current;
    if (!loggedInAccount) {
      setQueues([]);
      return;
    }
    const queueData = await apiRequestService.reqQueueGetAllForAccountPrivate();
    setQueues(queueData);

    let activeQueue = queueData.find(queue => queue.is_active_queue);
    if (!activeQueue) {
      activeQueue = queueData.find(queue => queue.medium_id === MediumEnum.Podcast)
    }

    if (activeQueue) {
      setActiveQueue(activeQueue);

      const combinedQueueResources: DTOQueueResource[] = [];

      const nowPlayingResource = await apiRequestService
        .reqQueueGetNowPlayingByQueueIdText(activeQueue.id_text);

      if (nowPlayingResource) {
        const upcomingQueueResources = await apiRequestService
          .reqQueueGetAllUpcomingByQueueIdText(activeQueue.id_text);
        combinedQueueResources.push(nowPlayingResource, ...upcomingQueueResources);
      }

      setActiveQueueUpcomingResources(combinedQueueResources);
    }
  }, []);
}
