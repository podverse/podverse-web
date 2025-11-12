import { useEffect, useRef } from "react";
import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from "podverse-helpers";
import { useMediaPlayer } from "../contexts/MediaPlayer";
import { useQueueResourcesMoveNowPlayingToHistory } from "./useQueueResourceMoveNowPlayingToHistory";
import { useQueueResourcesUpdateNowPlaying } from "./useQueueResourceUpdateNowPlaying";
import { useMediaPlayerCurrentTime } from "../contexts/MediaPlayerCurrentTime";
import { useQueueResourcesAbridgedIndex } from "../contexts/QueueResourcesAbridgedIndex";
import { AutoQueueConfig, useAutoQueue } from "../contexts/AutoQueue";

export function useMediaPlayerResourceUpdate() {
  const {
    setMPShouldPlay,
    setMPChannel,
    setMPClip,
    setMPItem,
    setMPItemChapter,
    setMPItemChapterShouldSeek,
    setMPItemSoundbite,
    setMPEnclosureRowSelected,
    setMPIsPlaying
  } = useMediaPlayer();
  const { autoQueueConfig, setAutoQueueConfig, setAutoQueueResources,
    setAutoQueueActiveRow } = useAutoQueue();
  const { mpEnclosureRowSelected, mpItem } = useMediaPlayer();
  const { setMPCurrentTime } = useMediaPlayerCurrentTime();
  const moveNowPlayingToHistory = useQueueResourcesMoveNowPlayingToHistory();
  const updateNowPlaying = useQueueResourcesUpdateNowPlaying();
  const { queueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();

  const queueResourcesAbridgedIndexRef = useRef(queueResourcesAbridgedIndex);
  useEffect(() => {
    queueResourcesAbridgedIndexRef.current = queueResourcesAbridgedIndex;
  }, [queueResourcesAbridgedIndex]);

  const autoQueueConfigRef = useRef(autoQueueConfig);
  useEffect(() => {
    autoQueueConfigRef.current = autoQueueConfig;
  }, [autoQueueConfig]);

  const mpEnclosureRowSelectedRef = useRef(mpEnclosureRowSelected);
  useEffect(() => {
    mpEnclosureRowSelectedRef.current = mpEnclosureRowSelected;
  }, [mpEnclosureRowSelected]);

  const mpItemRef = useRef(mpItem);
  useEffect(() => {
    mpItemRef.current = mpItem;
  }, [mpItem]);

  return ({
    shouldPlay,
    channel,
    clip,
    item,
    itemChapter,
    itemChapterShouldSeek,
    itemSoundbite,
    enclosureRowSelected,
    mpDuration,
    mpCurrentTime,
    isPlaying,
    skipMoveNowPlayingToHistory,
    newAutoQueueConfig,
    autoQueueShouldClear
  }: {
    shouldPlay?: boolean
    channel: DTOChannel | null,
    clip: DTOClip | null,
    item: DTOItem | null,
    itemChapter: DTOItemChapter | null,
    itemChapterShouldSeek: boolean,
    itemSoundbite: DTOItemSoundbite | null,
    enclosureRowSelected: number | 'use-active-item-or-default',
    mpDuration?: number,
    mpCurrentTime?: number,
    isPlaying?: boolean,
    skipMoveNowPlayingToHistory: boolean,
    newAutoQueueConfig: AutoQueueConfig,
    autoQueueShouldClear: boolean
  }) => {
    const previousItemId = mpItemRef.current?.id;

    if (!skipMoveNowPlayingToHistory) {
      moveNowPlayingToHistory({
        mpClip: clip,
        mpItem: item,
        mpItemSoundbite: itemSoundbite
      });
    }

    if (autoQueueShouldClear) {
      setAutoQueueResources({});
      setAutoQueueActiveRow(null);
    }

    const oldAutoQueueConfig = autoQueueConfigRef.current;
    if (newAutoQueueConfig != undefined) {
      setAutoQueueConfig({
        ...oldAutoQueueConfig,
        ...newAutoQueueConfig
      });
    }

    if (shouldPlay !== undefined) {
      setMPShouldPlay(shouldPlay);
    }
    
    setMPChannel(channel);
    setMPClip(clip);
    setMPItem(item);
    setMPItemChapter(itemChapter);
    setMPItemChapterShouldSeek(itemChapterShouldSeek);
    setMPItemSoundbite(itemSoundbite);

    if (enclosureRowSelected === 'use-active-item-or-default') {
      if (previousItemId && item && item.id === previousItemId) {
        setMPEnclosureRowSelected(mpEnclosureRowSelectedRef.current);
      } else {
        setMPEnclosureRowSelected(0);
      }
    } else {
      setMPEnclosureRowSelected(enclosureRowSelected);
    }

    if (isPlaying !== undefined) {
      setMPIsPlaying(isPlaying);
    }

    // Assign the resource you are loading's abridged index data to the media player
    // so that it is already loaded by the time the now playing resource is updated within the queue.
    // Else, clear the previous items current time and duration by setting to 0
    // (because they will be updated shortly after by the media audio/video controllers anyway).
    function getAbridgedAndSet(resource: any, abridgedMap: Record<string, any>) {
      const abridged = resource ? abridgedMap?.[resource.id] : undefined;
      const currentTime = Number(abridged?.p) || 0;
      const duration = Number(abridged?.d) || 0;
      setMPCurrentTime(currentTime);
      return { currentTime, duration };
    }

    let timeData = { currentTime: 0, duration: 0 };

    if (clip) {
      timeData = getAbridgedAndSet(clip, queueResourcesAbridgedIndexRef.current.clips);
    } else if (itemSoundbite) {
      timeData = getAbridgedAndSet(itemSoundbite, queueResourcesAbridgedIndexRef.current.item_soundbites);
    } else if (item) {
      timeData = getAbridgedAndSet(item, queueResourcesAbridgedIndexRef.current.items);
    } else {
      setMPCurrentTime(0);
    }

    const finalDuration = mpDuration !== undefined ? mpDuration : timeData.duration;
    const finalCurrentTime = mpCurrentTime !== undefined ? mpCurrentTime : timeData.currentTime;

    updateNowPlaying({
      mpClip: clip,
      mpItem: item,
      mpItemSoundbite: itemSoundbite,
      mpDuration: finalDuration,
      mpCurrentTime: finalCurrentTime
    });
  };
}
