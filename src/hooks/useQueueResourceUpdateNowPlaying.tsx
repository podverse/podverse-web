import { useRef, useEffect, useCallback } from "react";
import { useAccount } from "../contexts/Account";
import { useQueues } from "../contexts/Queue";
import { apiRequestService } from "../factories/apiRequestService";
import { useMediaPlayer } from "../contexts/MediaPlayer";
import { useMediaPlayerCurrentTime } from "../contexts/MediaPlayerCurrentTime";
import { useQueueResourcesAbridgedIndexUpdate } from "./useQueueResourcesAbridgedIndexUpdate";

export function useQueueResourcesUpdateNowPlaying() {
  const { loggedInAccount } = useAccount();
  const { activeQueue } = useQueues();
  const { mpClip, mpItem, mpItemSoundbite, mpDuration } = useMediaPlayer();
  const { mpCurrentTime } = useMediaPlayerCurrentTime();
  const updateAbridgedIndex = useQueueResourcesAbridgedIndexUpdate();

  const activeQueueRef = useRef(activeQueue);
  const mpClipRef = useRef(mpClip);
  const mpItemRef = useRef(mpItem);
  const mpItemSoundbiteRef = useRef(mpItemSoundbite);
  const mpCurrentTimeRef = useRef(mpCurrentTime);
  const mpDurationRef = useRef(mpDuration);
  const loggedInAccountRef = useRef(loggedInAccount);

  useEffect(() => { activeQueueRef.current = activeQueue; }, [activeQueue]);
  useEffect(() => { mpClipRef.current = mpClip; }, [mpClip]);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);
  useEffect(() => { mpItemSoundbiteRef.current = mpItemSoundbite; }, [mpItemSoundbite]);
  useEffect(() => { mpCurrentTimeRef.current = mpCurrentTime; }, [mpCurrentTime]);
  useEffect(() => { mpDurationRef.current = mpDuration; }, [mpDuration]);
  useEffect(() => { loggedInAccountRef.current = loggedInAccount; }, [loggedInAccount]);

  return useCallback(async () => {
    const activeQueue = activeQueueRef.current;
    const mpClip = mpClipRef.current;
    const mpItem = mpItemRef.current;
    const mpItemSoundbite = mpItemSoundbiteRef.current;
    const mpCurrentTime = mpCurrentTimeRef.current;
    const mpDuration = mpDurationRef.current;
    const loggedInAccount = loggedInAccountRef.current;

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
