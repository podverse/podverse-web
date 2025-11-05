import { useRef, useEffect, useCallback } from "react";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";
import { useQueueResourcesAbridgedIndexUpdate } from "./useQueueResourcesAbridgedIndexUpdate";
import { DTOClip, DTOItem, DTOItemSoundbite } from "podverse-helpers";

type UpdateNowPlayingParams = {
  mpClip: DTOClip | null;
  mpItem: DTOItem | null;
  mpItemSoundbite: DTOItemSoundbite | null;
  mpDuration?: number;
  mpCurrentTime?: number;
}

export function useQueueResourcesUpdateNowPlaying() {
  const { loggedInAccount } = useAccount();
  const { activeQueue } = useQueues();
  const updateAbridgedIndex = useQueueResourcesAbridgedIndexUpdate();

  const activeQueueRef = useRef(activeQueue);
  const loggedInAccountRef = useRef(loggedInAccount);

  useEffect(() => { activeQueueRef.current = activeQueue; }, [activeQueue]);
  useEffect(() => { loggedInAccountRef.current = loggedInAccount; }, [loggedInAccount]);

  return useCallback(async (params: UpdateNowPlayingParams) => {
    const loggedInAccount = loggedInAccountRef.current;
    const activeQueue = activeQueueRef.current;

    const { mpClip, mpItem, mpItemSoundbite, mpDuration,  mpCurrentTime } = params;

    if (!loggedInAccount || !activeQueue) {
      return;
    }

    updateAbridgedIndex();

    apiRequestService.reqQueueUpdateIsActiveQueue(
      activeQueue.id_text,
      true
    );

    if (mpClip) {
      await apiRequestService.reqQueueResourceClipAddNowPlaying(
        activeQueue.id_text,
        mpClip.id_text,
        {
          playback_position: mpCurrentTime?.toString(),
          media_file_duration: mpDuration?.toString()
        }
      );
    } else if (mpItemSoundbite) {
      await apiRequestService.reqQueueResourceItemSoundbiteAddNowPlaying(
        activeQueue.id_text,
        mpItemSoundbite.id_text,
        {
          playback_position: mpCurrentTime?.toString(),
          media_file_duration: mpDuration?.toString()
        }
      );
    } else if (mpItem) {
      await apiRequestService.reqQueueResourceItemAddNowPlaying(
        activeQueue.id_text,
        mpItem.id_text,
        {
          playback_position: mpCurrentTime?.toString(),
          media_file_duration: mpDuration?.toString()
        }
      );
    }
  }, []);
}
