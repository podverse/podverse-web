import { useCallback, useRef, useEffect } from "react";
import { MediumEnum, DTOQueueResource } from "podverse-helpers";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";
import { autoQueueIncrementActiveRow, useAutoQueue } from "../contexts/AutoQueue";

export function useQueueResourcesLoadActive() {
  const { loggedInAccount } = useAccount();
  const { autoQueueActiveRow, setAutoQueueActiveRow } = useAutoQueue();

  const loggedInAccountRef = useRef(loggedInAccount);
  const autoQueueActiveRowRef = useRef(autoQueueActiveRow);

  useEffect(() => {
    loggedInAccountRef.current = loggedInAccount;
  }, [loggedInAccount]);

  useEffect(() => {
    autoQueueActiveRowRef.current = autoQueueActiveRow;
  }, [autoQueueActiveRow]);

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
      activeQueue = queueData.find(queue => queue.medium_id === MediumEnum.AV);
    }

    if (activeQueue) {
      setActiveQueue(activeQueue);

      const combinedQueueResources: DTOQueueResource[] = [];

      const nowPlayingResource = await apiRequestService
        .reqQueueResourcesGetNowPlayingByQueueIdText(activeQueue.id_text);

      if (nowPlayingResource) {
        const upcomingQueueResources = await apiRequestService
          .reqQueueResourcesGetAllUpcomingByQueueIdText(activeQueue.id_text);

        combinedQueueResources.push(nowPlayingResource, ...upcomingQueueResources);
      }

      setActiveQueueUpcomingResources(combinedQueueResources);

      if (combinedQueueResources.length === 0) {
        const autoQueueActiveRow = autoQueueActiveRowRef.current;
        const newAutoQueueActiveRow = autoQueueIncrementActiveRow(autoQueueActiveRow);
        setAutoQueueActiveRow(newAutoQueueActiveRow);
      }
    }
  }, []);
}
