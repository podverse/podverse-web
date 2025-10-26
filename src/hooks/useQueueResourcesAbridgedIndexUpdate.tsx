import { QueueResourceAbridgedUpdates, updateQueueResourceAbridgedIndex } from "podverse-helpers";
import { useRef, useEffect, useCallback } from "react";
import { useMediaPlayer } from "../contexts/MediaPlayer";
import { useQueueResourcesAbridgedIndex } from "../contexts/QueueResourcesAbridgedIndex";
import { useMediaPlayerCurrentTime } from "../contexts/MediaPlayerCurrentTime";
import { useAccount } from "../contexts/Account";

export function useQueueResourcesAbridgedIndexUpdate() {
  const { mpClip, mpItemSoundbite, mpItem, mpDuration } = useMediaPlayer();
  const { loggedInAccount } = useAccount();
  const { mpCurrentTime } = useMediaPlayerCurrentTime();
  const { queueResourcesAbridgedIndex, setQueueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();

  const mpClipRef = useRef(mpClip);
  const mpItemSoundbiteRef = useRef(mpItemSoundbite);
  const mpItemRef = useRef(mpItem);
  const mpDurationRef = useRef(mpDuration);
  const mpCurrentTimeRef = useRef(mpCurrentTime);
  const queueResourcesAbridgedIndexRef = useRef(queueResourcesAbridgedIndex);

  useEffect(() => { mpClipRef.current = mpClip; }, [mpClip]);
  useEffect(() => { mpItemSoundbiteRef.current = mpItemSoundbite; }, [mpItemSoundbite]);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);
  useEffect(() => { mpDurationRef.current = mpDuration; }, [mpDuration]);
  useEffect(() => { mpCurrentTimeRef.current = mpCurrentTime; }, [mpCurrentTime]);
  useEffect(() => { queueResourcesAbridgedIndexRef.current = queueResourcesAbridgedIndex; }, [queueResourcesAbridgedIndex]);

  return useCallback((completed?: boolean) => {
    if (!loggedInAccount) {
      return;
    }

    const clip = mpClipRef.current;
    const itemSoundbite = mpItemSoundbiteRef.current;
    const item = mpItemRef.current;
    const mpDuration = mpDurationRef.current;
    const mpCurrentTime = mpCurrentTimeRef.current;

    const updates: QueueResourceAbridgedUpdates = {
      clip: clip
        ? {
            i: clip.id,
            p: mpCurrentTime?.toString() ?? "0",
            d: mpDuration?.toString() ?? "0",
            z: completed !== undefined ? completed : queueResourcesAbridgedIndexRef.current.clips[clip.id]?.z === true,
          }
        : null,
      item_soundbite: itemSoundbite
        ? {
            i: itemSoundbite.id,
            p: mpCurrentTime?.toString() ?? "0",
            d: mpDuration?.toString() ?? "0",
            z: completed !== undefined ? completed : queueResourcesAbridgedIndexRef.current.item_soundbites[itemSoundbite.id]?.z === true,
          }
        : null,
      item: item
        ? {
            i: item.id,
            p: mpCurrentTime?.toString() ?? "0",
            d: mpDuration?.toString() ?? "0",
            z: completed !== undefined ? completed : queueResourcesAbridgedIndexRef.current.items[item.id]?.z === true,
          }
        : null,
      add_by_rss_resource_data: null,
    };

    const updatedIndex = updateQueueResourceAbridgedIndex(queueResourcesAbridgedIndexRef.current, updates);
    setQueueResourcesAbridgedIndex(updatedIndex);
  }, []);
}