import { useEffect, useRef } from "react";
import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from "podverse-helpers";
import { useMediaPlayer } from "../contexts/MediaPlayer";
import { useQueueResourcesMoveNowPlayingToHistory } from "./useQueueResourceMoveNowPlayingToHistory";
import { useQueueResourcesUpdateNowPlaying } from "./useQueueResourceUpdateNowPlaying";
import { useMediaPlayerCurrentTime } from "../contexts/MediaPlayerCurrentTime";
import { useQueueResourcesAbridgedIndex } from "../contexts/QueueResourcesAbridgedIndex";

export function useMediaPlayerResourceUpdate() {
  const {
    setMPShouldPlay,
    setMPChannel,
    setMPClip,
    setMPItem,
    setMPItemChapter,
    setMPItemChapterShouldSeek,
    setMPItemSoundbite,
    setMPIsPlaying,
    setMPDuration
  } = useMediaPlayer();

  const { setMPCurrentTime } = useMediaPlayerCurrentTime();
  const moveNowPlayingToHistory = useQueueResourcesMoveNowPlayingToHistory();
  const updateNowPlaying = useQueueResourcesUpdateNowPlaying();
  const { queueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();

  const queueResourcesAbridgedIndexRef = useRef(queueResourcesAbridgedIndex);
  useEffect(() => {
    queueResourcesAbridgedIndexRef.current = queueResourcesAbridgedIndex;
  }, [queueResourcesAbridgedIndex]);

  return ({
    shouldPlay,
    channel,
    clip,
    item,
    itemChapter,
    itemChapterShouldSeek,
    itemSoundbite,
    isPlaying
  }: {
    shouldPlay?: boolean
    channel: DTOChannel | null,
    clip: DTOClip | null,
    item: DTOItem | null,
    itemChapter: DTOItemChapter | null,
    itemChapterShouldSeek: boolean,
    itemSoundbite: DTOItemSoundbite | null,
    isPlaying?: boolean,
  }) => {
    moveNowPlayingToHistory();

    if (shouldPlay !== undefined) {
      setMPShouldPlay(shouldPlay);
    }
    setMPChannel(channel);
    setMPClip(clip);
    setMPItem(item);
    setMPItemChapter(itemChapter);
    setMPItemChapterShouldSeek(itemChapterShouldSeek);
    setMPItemSoundbite(itemSoundbite);
    if (isPlaying !== undefined) {
      setMPIsPlaying(isPlaying);
    }

    // Assign the resource you are loading's abridged index data to the media player
    // so that it is already loaded by the time the now playing resource is updated within the queue.
    // Else, clear the previous items current time and duration by setting to 0
    // (because they will be updated shortly after by the media audio/video controllers anyway).
    function getAbridgedAndSet(resource: any, abridgedMap: Record<string, any>) {
      const abridged = resource ? abridgedMap?.[resource.id] : undefined;
      setMPCurrentTime(Number(abridged?.p) || 0);
      setMPDuration(Number(abridged?.d) || 0);
    }

    if (clip) {
      getAbridgedAndSet(clip, queueResourcesAbridgedIndexRef.current.clips);
    } else if (itemSoundbite) {
      getAbridgedAndSet(itemSoundbite, queueResourcesAbridgedIndexRef.current.item_soundbites);
    } else if (item) {
      getAbridgedAndSet(item, queueResourcesAbridgedIndexRef.current.items);
    } else {
      setMPCurrentTime(0);
      setMPDuration(0);
    }

    // Wait a cycle to ensure the MP state that was changed above has finished updating
    setTimeout(() => {
      updateNowPlaying();
    }, 0);
  };
}
