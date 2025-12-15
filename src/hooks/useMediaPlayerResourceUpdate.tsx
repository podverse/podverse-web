import { useEffect, useRef } from "react";
import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite,
  EnclosureSelectedParams, MediumEnum } from "podverse-helpers";
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
    setMPItemLabeledItemEnclosures,
    setMPEnclosureSelectedParams,
    setMPIsPlaying
  } = useMediaPlayer();
  const { autoQueueConfig, setAutoQueueConfig, setAutoQueueResources,
    setAutoQueueActiveRow } = useAutoQueue();
  const { mpEnclosureSelectedParams, mpItem } = useMediaPlayer();
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

  const mpEnclosureSelectedParamsRef = useRef(mpEnclosureSelectedParams);
  useEffect(() => {
    mpEnclosureSelectedParamsRef.current = mpEnclosureSelectedParams;
  }, [mpEnclosureSelectedParams]);

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
    enclosureSelectedParams,
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
    enclosureSelectedParams: EnclosureSelectedParams | 'use-active-item-or-default',
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

    if (enclosureSelectedParams === 'use-active-item-or-default' || !enclosureSelectedParams) {
      if (previousItemId && item && item.id === previousItemId) {
        setMPEnclosureSelectedParams(mpEnclosureSelectedParamsRef.current);
      } else {
        setMPEnclosureSelectedParams({
          type: "default",
          enclosureRowSelected: null,
          sourceRowSelected: null
        });
        setMPItemLabeledItemEnclosures([]);
      }
    } else {
      setMPEnclosureSelectedParams(enclosureSelectedParams);
    }

    if (isPlaying !== undefined) {
      setMPIsPlaying(isPlaying);
    }

    // Assign the resource you are loading's abridged index data to the media player
    // so that it is already loaded by the time the now playing resource is updated within the queue.
    // Else, clear the previous items current time and duration by setting to 0
    // (because they will be updated shortly after by the media audio/video controllers anyway).
    function getAbridgedAndSet(resource: any, abridgedMap: Record<string, any>, preventSet: boolean = false) {
      const abridged = resource ? abridgedMap?.[resource.id] : undefined;
      const currentTime = Number(abridged?.p) || 0;
      const duration = Number(abridged?.d) || 0;

      if (!preventSet) {
        setMPCurrentTime(currentTime);
      }

      return { currentTime, duration };
    }

    let timeData = { currentTime: 0, duration: 0 };

    if (clip) {
      timeData = getAbridgedAndSet(clip, queueResourcesAbridgedIndexRef.current.clips);
    } else if (itemSoundbite) {
      timeData = getAbridgedAndSet(itemSoundbite, queueResourcesAbridgedIndexRef.current.item_soundbites);
    } else if (item) {
      if (channel?.medium_id === MediumEnum.Podcast || channel?.medium_id === MediumEnum.Video) {
        timeData = getAbridgedAndSet(item, queueResourcesAbridgedIndexRef.current.items);
      } else {
        const preventSet = true;
        const tempTimeData = getAbridgedAndSet(item, queueResourcesAbridgedIndexRef.current.items, preventSet);
        timeData = { currentTime: 0, duration: tempTimeData.duration };
        setMPCurrentTime(0);
      }
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
