import { useCallback, useRef, useEffect } from "react";
import { MediumEnum, DTOQueueResource } from "podverse-helpers";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";
import { autoQueueIncrementActiveRow, useAutoQueue } from "../contexts/AutoQueue";

/*
  NOTE: If you want useQueueResourcesLoadActive to load the next item
  from the queue or auto-queue, and to skip the current "now playing item",
  you must call moveNowPlayingToHistory before calling this hook's returned function.
  (example: TrackNextButton, TrackNextButtonMobile, and MediaPlayerControllerAV)
*/

export function useQueueResourcesLoadActive() {
  const { loggedInAccount } = useAccount();
  const { autoQueueActiveRow, setAutoQueueActiveRow, autoQueueResources, autoQueueConfig } = useAutoQueue();
  const { setQueues, setActiveQueue, setActiveQueueUpcomingResources } = useQueues();

  const loggedInAccountRef = useRef(loggedInAccount);
  const autoQueueActiveRowRef = useRef(autoQueueActiveRow);
  const autoQueueResourcesRef = useRef(autoQueueResources);
  const autoQueueConfigRef = useRef(autoQueueConfig);

  useEffect(() => {
    loggedInAccountRef.current = loggedInAccount;
  }, [loggedInAccount]);

  useEffect(() => {
    autoQueueActiveRowRef.current = autoQueueActiveRow;
  }, [autoQueueActiveRow]);

  useEffect(() => {
    autoQueueResourcesRef.current = autoQueueResources;
  }, [autoQueueResources]);

  useEffect(() => {
    autoQueueConfigRef.current = autoQueueConfig;
  }, [autoQueueConfig]);

  return useCallback(async () => {
    const loggedInAccount = loggedInAccountRef.current;
    const autoQueueConfig = autoQueueConfigRef.current;
    const autoQueueActiveRow = autoQueueActiveRowRef.current;
    const autoQueueResources = autoQueueResourcesRef.current;

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
      
      const upcomingQueueResources = await apiRequestService
        .reqQueueResourcesGetAllUpcomingByQueueIdText(activeQueue.id_text);

      if (nowPlayingResource) {
        combinedQueueResources.push(nowPlayingResource, ...upcomingQueueResources);
      } else if (upcomingQueueResources.length > 0) {
        combinedQueueResources.push(...upcomingQueueResources);
      }

      setActiveQueueUpcomingResources(combinedQueueResources);

      if (combinedQueueResources.length === 0) {
        const nextAutoQueueActiveRow = autoQueueIncrementActiveRow(autoQueueActiveRow);
        if (autoQueueResources[nextAutoQueueActiveRow]) {
          setAutoQueueActiveRow(nextAutoQueueActiveRow);
        } else if (autoQueueConfig.repeat) {
          setAutoQueueActiveRow(0);
        }
      }
    }
  }, []);
}
