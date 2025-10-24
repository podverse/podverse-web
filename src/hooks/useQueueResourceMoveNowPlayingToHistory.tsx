import { useRef, useEffect, useCallback } from "react";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";
import { useMediaPlayer } from "../contexts/MediaPlayer";

export function useQueueResourcesMoveNowPlayingToHistory() {
  const { loggedInAccount } = useAccount();
  const { activeQueue } = useQueues();
  const { mpClip, mpItem, mpItemSoundbite } = useMediaPlayer();

  const activeQueueRef = useRef(activeQueue);
  const mpClipRef = useRef(mpClip);
  const mpItemRef = useRef(mpItem);
  const mpItemSoundbiteRef = useRef(mpItemSoundbite);
  const loggedInAccountRef = useRef(loggedInAccount);

  useEffect(() => { activeQueueRef.current = activeQueue; }, [activeQueue]);
  useEffect(() => { mpClipRef.current = mpClip; }, [mpClip]);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);
  useEffect(() => { mpItemSoundbiteRef.current = mpItemSoundbite; }, [mpItemSoundbite]);
  useEffect(() => { loggedInAccountRef.current = loggedInAccount; }, [loggedInAccount]);

  return useCallback(async () => {
    const activeQueue = activeQueueRef.current;
    const mpItem = mpItemRef.current;
    const loggedInAccount = loggedInAccountRef.current;

    if (!loggedInAccount || !activeQueue) {
      return;
    }

    if (mpClip) {
      await apiRequestService.reqQueueResourceClipAddHistory(
        activeQueue.id_text,
        mpClip.id_text,
        {
          completed: true
        }
      );
    } else if (mpItemSoundbite) {
      await apiRequestService.reqQueueResourceItemSoundbiteAddHistory(
        activeQueue.id_text,
        mpItemSoundbite.id_text,
        {
          completed: true
        }
      );
    } else if (mpItem) {
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
