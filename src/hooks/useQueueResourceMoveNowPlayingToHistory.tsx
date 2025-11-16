import { useRef, useEffect, useCallback } from "react";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";
import { useQueueResourcesAbridgedIndexUpdate } from "./useQueueResourcesAbridgedIndexUpdate";
import { DTOClip, DTOItem, DTOItemSoundbite } from "podverse-helpers";

export type MoveNowPlayingToHistoryCallbackParams = {
  completed?: boolean;
  mpClip: DTOClip | null;
  mpItem: DTOItem | null;
  mpItemSoundbite: DTOItemSoundbite | null;
}

export function useQueueResourcesMoveNowPlayingToHistory() {
  const { loggedInAccount } = useAccount();
  const { activeQueue } = useQueues();
  const updateAbridgedIndex = useQueueResourcesAbridgedIndexUpdate();

  const activeQueueRef = useRef(activeQueue);
  const loggedInAccountRef = useRef(loggedInAccount);

  useEffect(() => { activeQueueRef.current = activeQueue; }, [activeQueue]);
  useEffect(() => { loggedInAccountRef.current = loggedInAccount; }, [loggedInAccount]);

  return useCallback(async (params: MoveNowPlayingToHistoryCallbackParams) => {
    const activeQueue = activeQueueRef.current;
    const loggedInAccount = loggedInAccountRef.current;
    const { completed, mpClip, mpItem, mpItemSoundbite } = params;
    const isLiveItem = !!mpItem?.live_item;

    if (!loggedInAccount || !activeQueue || isLiveItem) {
      return;
    }

    updateAbridgedIndex(completed);

    if (mpClip) {
      await apiRequestService.reqQueueResourceClipAddHistory(
        activeQueue.id_text,
        mpClip.id_text,
        {
          playback_position: mpClip.start_time,
          ...(completed !== undefined ? { completed } : {})
        }
      );
    } else if (mpItemSoundbite) {
      await apiRequestService.reqQueueResourceItemSoundbiteAddHistory(
        activeQueue.id_text,
        mpItemSoundbite.id_text,
        {
          playback_position: mpItemSoundbite.start_time,
          ...(completed !== undefined ? { completed } : {})
        }
      );
    } else if (mpItem) {
      await apiRequestService.reqQueueResourceItemAddHistory(
        activeQueue.id_text,
        mpItem.id_text,
        {
          ...(completed ? { playback_position: '0' } : {}),
          ...(completed !== undefined ? { completed } : {})
        }
      );
    }
  }, []);
}
