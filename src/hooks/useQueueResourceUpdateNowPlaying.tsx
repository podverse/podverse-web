import { useRef, useEffect, useCallback } from "react";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";
import { useQueueResourcesAbridgedIndexUpdate } from "./useQueueResourcesAbridgedIndexUpdate";
import { DTOChannel, DTOClip, DTOItem, DTOItemSoundbite, getQueueMediumIdFromMediumId } from "podverse-helpers";

export type UpdateNowPlayingParams = {
  mpChannel: DTOChannel | null;
  mpClip: DTOClip | null;
  mpItem: DTOItem | null;
  mpItemSoundbite: DTOItemSoundbite | null;
  mpDuration?: number;
  mpCurrentTime?: number;
}

export function useQueueResourcesUpdateNowPlaying() {
  const { loggedInAccount } = useAccount();
  const { queues, setActiveQueue } = useQueues();
  const updateAbridgedIndex = useQueueResourcesAbridgedIndexUpdate();

  const queuesRef = useRef(queues);
  const loggedInAccountRef = useRef(loggedInAccount);

  useEffect(() => { queuesRef.current = queues; }, [queues]);
  useEffect(() => { loggedInAccountRef.current = loggedInAccount; }, [loggedInAccount]);

  return useCallback(async (params: UpdateNowPlayingParams) => {
    const loggedInAccount = loggedInAccountRef.current;
    const queues = queuesRef.current;

    const { mpChannel, mpClip, mpItem, mpItemSoundbite, mpDuration,  mpCurrentTime } = params;
    
    const activeQueue = queues.find(q => {
      return q.medium_id === (mpChannel?.medium_id && getQueueMediumIdFromMediumId(mpChannel?.medium_id));
    });

    if (!loggedInAccount || !activeQueue) {
      return;
    }

    updateAbridgedIndex();

    apiRequestService.reqQueueUpdateIsActiveQueue(
      activeQueue.id_text,
      true
    );
    setActiveQueue({
      ...activeQueue,
      is_active_queue: true
    });

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
