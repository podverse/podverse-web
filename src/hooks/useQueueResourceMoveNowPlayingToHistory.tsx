import { useRef, useEffect, useCallback } from "react";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";
import { useMediaPlayer } from "../contexts/MediaPlayer";

export function useQueueResourcesMoveNowPlayingToHistory() {
  const { loggedInAccount } = useAccount();
  const { activeQueue } = useQueues();
  const { mpItem } = useMediaPlayer();

  const activeQueueRef = useRef(activeQueue);
  const mpItemRef = useRef(mpItem);
  const loggedInAccountRef = useRef(loggedInAccount);

  useEffect(() => { activeQueueRef.current = activeQueue; }, [activeQueue]);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);
  useEffect(() => { loggedInAccountRef.current = loggedInAccount; }, [loggedInAccount]);

  return useCallback(async () => {
    const activeQueue = activeQueueRef.current;
    const mpItem = mpItemRef.current;
    const loggedInAccount = loggedInAccountRef.current;

    if (!loggedInAccount || !activeQueue) {
      return;
    }

    if (mpItem) {
      await apiRequestService.reqQueueResourceItemAddHistory(
        activeQueue.id_text,
        mpItem.id_text,
        {
          completed: true
        }
      );
    }
  }, []);
}
