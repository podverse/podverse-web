"use client";

import { buildLabeledItemEnclosures, DTOItemQueueItem, DTOQueueResource } from "podverse-helpers";
import React, { useEffect, useRef } from "react";
import { MediaPlayerControllerAudio } from "./Audio/MediaPlayerControllerAudio";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { EVENTS } from "../../../constants/events";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useQueues } from "../../../contexts/Queue";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import { getAutoQueueChannelMedium, checkIsActiveRowHighestKey, useAutoQueue } from "../../../contexts/AutoQueue";
import { updateLayoutForMediaPlayer } from "../../../utils/mediaPlayer/mediaPlayerLayout";
import { useAutoQueueLoadResources } from "../../../hooks/useAutoQueueLoadResources";
import { MediaPlayerVideoWrapper } from "./Video/MediaPlayerVideoWrapper";
import { MediaPlayerLiveStreamVideoWrapper } from "./LiveStream/MediaPlayerLiveStreamVideoWrapper";
import { MediaPlayerControllerLiveStreamAudio } from "./LiveStream/MediaPlayerControllerLiveStreamAudio";

export const MediaPlayerController: React.FC = () => {
  const { mpChannel, mpItem, mpClip, mpItemSoundbite, mpDuration,
    setMPItemChapters, setMPItemLabeledItemEnclosures } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { mpCurrentTime } = useMediaPlayerCurrentTime();
  const { activeQueueUpcomingResources } = useQueues();
  const { autoQueueResources, autoQueueActiveRow, autoQueueConfig } = useAutoQueue();
  const autoQueueLoadResources = useAutoQueueLoadResources();

  const autoQueueResourcesRef = useRef(autoQueueResources);
  useEffect(() => {
    autoQueueResourcesRef.current = autoQueueResources;
  }, [autoQueueResources]);

  const autoQueueActiveRowRef = useRef(autoQueueActiveRow);
  useEffect(() => {
    autoQueueActiveRowRef.current = autoQueueActiveRow;
  }, [autoQueueActiveRow]);

  const autoQueueConfigRef = useRef(autoQueueConfig);
  useEffect(() => {
    autoQueueConfigRef.current = autoQueueConfig;
  }, [autoQueueConfig]);

  const handleKeyDown = (e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    if (e.key === "ArrowLeft") {
      const newTime = Math.max(0, mpCurrentTime - 10);
      window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.SEEK, { detail: { time: newTime } }));
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      const newTime = Math.min(mpDuration, mpCurrentTime + 10);
      window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.SEEK, { detail: { time: newTime } }));
      e.preventDefault();
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  });

  useEffect(() => {
    updateLayoutForMediaPlayer(!!mpChannel);
  }, [mpChannel]);

  useEffect(() => {
    const fetchItemChapters = async () => {
      if (mpItem?.id_text) {
        const response = await apiRequestService.reqItemParseAndGetChapters(
          mpItem.id_text
        );
        setMPItemChapters(response.data);
      }
    }

    const fetchAutoQueueResources = async () => {
      const autoQueueResources = autoQueueResourcesRef.current;
      const autoQueueActiveRow = autoQueueActiveRowRef.current;

      const isActiveRowHighestKey = checkIsActiveRowHighestKey(
        autoQueueActiveRow,
        autoQueueResources
      );

      const isAutoQueueResourcesEmpty = Object
        .keys(autoQueueResources)
        .map(Number)
        .length === 0;

      if (isActiveRowHighestKey || isAutoQueueResourcesEmpty) {
        if (mpItem?.id_text) {
          await autoQueueLoadResources();
        }
      }
    };

    const fetchItemLabeledItemEnclosures = async () => {
      const mpItemLabeledEnclosures = buildLabeledItemEnclosures(mpItem?.item_enclosures || []);
      setMPItemLabeledItemEnclosures(mpItemLabeledEnclosures);
    }

    fetchItemChapters();
    fetchAutoQueueResources();
    fetchItemLabeledItemEnclosures();
  }, [mpItem])

  async function handleLoadAutoQueueItem(itemQueueItem: DTOItemQueueItem) {
    if (itemQueueItem && itemQueueItem?.id_text !== mpItem?.id_text) {
      const fullItem = await apiRequestService.reqItemGetByIdOrIdText(itemQueueItem.id_text);
      if (fullItem) {
        const fullChannel = await apiRequestService.reqChannelGetByIdOrIdText(fullItem.channel_id);
        if (fullChannel) {
          mediaPlayerResourceUpdate({
            channel: fullChannel,
            clip: null,
            item: fullItem,
            itemChapter: null,
            itemChapterShouldSeek: false,
            itemSoundbite: null,
            enclosureSelectedParams: 'use-active-item-or-default',
            skipMoveNowPlayingToHistory: true,
            newAutoQueueConfig: {
              aqmedium: getAutoQueueChannelMedium(fullChannel),
              playlist_id_text: autoQueueConfigRef.current.playlist_id_text,
              disabled: false,
              random: autoQueueConfigRef.current.random,
              repeat: autoQueueConfigRef.current.repeat,
              nextPage: autoQueueConfigRef.current.nextPage || 1,
              shuffleHash: autoQueueConfigRef.current.shuffleHash
            },
            autoQueueShouldClear: false
          });
        }
      }
    }
  }

  async function handleLoadQueueItem(nextResource: DTOQueueResource) {
    if (nextResource?.item && nextResource?.item?.id_text !== mpItem?.id_text) {
      const fullItem = await apiRequestService.reqItemGetByIdOrIdText(nextResource.item.id_text);
      if (fullItem) {
        const fullChannel = await apiRequestService.reqChannelGetByIdOrIdText(fullItem.channel_id);
        if (fullChannel) {
          mediaPlayerResourceUpdate({
            channel: fullChannel,
            clip: null,
            item: fullItem,
            itemChapter: null,
            itemChapterShouldSeek: false,
            itemSoundbite: null,
            enclosureSelectedParams: 'use-active-item-or-default',
            skipMoveNowPlayingToHistory: true,
            newAutoQueueConfig: {
              aqmedium: getAutoQueueChannelMedium(fullChannel),
              playlist_id_text: autoQueueConfigRef.current.playlist_id_text,
              disabled: false,
              random: autoQueueConfigRef.current.random,
              repeat: autoQueueConfigRef.current.repeat,
              nextPage: autoQueueConfigRef.current.nextPage || 1,
              shuffleHash: autoQueueConfigRef.current.shuffleHash
            },
            autoQueueShouldClear: true
          });
        }
      }
    }
  }

  async function handleLoadQueueClip(nextResource: DTOQueueResource) {
    if (nextResource?.clip && nextResource?.clip?.id_text !== mpClip?.id_text) {
      const fullClip = await apiRequestService.reqClipGet(nextResource.clip.id_text);
      if (fullClip) {
        const fullItem = await apiRequestService.reqItemGetByIdOrIdText(fullClip.item.id_text);
        if (fullItem) {
          const fullChannel = await apiRequestService.reqChannelGetByIdOrIdText(fullItem.channel_id);
          if (fullChannel) {
            mediaPlayerResourceUpdate({
              channel: fullChannel,
              clip: fullClip,
              item: fullItem,
              itemChapter: null,
              itemChapterShouldSeek: false,
              itemSoundbite: null,
              enclosureSelectedParams: 'use-active-item-or-default',
              skipMoveNowPlayingToHistory: true,
              newAutoQueueConfig: {
                aqmedium: getAutoQueueChannelMedium(fullChannel),
                playlist_id_text: autoQueueConfigRef.current.playlist_id_text,
                disabled: false,
                random: autoQueueConfigRef.current.random,
                repeat: autoQueueConfigRef.current.repeat,
                nextPage: autoQueueConfigRef.current.nextPage || 1,
                shuffleHash: autoQueueConfigRef.current.shuffleHash
              },
              autoQueueShouldClear: true
            });
          }
        }
      }
    }
  }

  async function handleLoadQueueItemSoundbite(nextResource: DTOQueueResource) {
    if (nextResource?.item_soundbite && nextResource?.item_soundbite?.id_text !== mpItemSoundbite?.id_text) {
      const fullItemSoundbite = await apiRequestService.reqItemSoundbiteGet(nextResource.item_soundbite.id_text);
      if (fullItemSoundbite?.item) {
        const fullItem = await apiRequestService.reqItemGetByIdOrIdText(fullItemSoundbite.item.id_text);
        if (fullItem) {
          const fullChannel = await apiRequestService.reqChannelGetByIdOrIdText(fullItem.channel_id);
          if (fullChannel) {
            mediaPlayerResourceUpdate({
              channel: fullChannel,
              clip: null,
              item: fullItem,
              itemChapter: null,
              itemChapterShouldSeek: false,
              itemSoundbite: fullItemSoundbite,
              enclosureSelectedParams: 'use-active-item-or-default',
              skipMoveNowPlayingToHistory: true,
              newAutoQueueConfig: {
                aqmedium: getAutoQueueChannelMedium(fullChannel),
                playlist_id_text: autoQueueConfigRef.current.playlist_id_text,
                disabled: false,
                random: autoQueueConfigRef.current.random,
                repeat: autoQueueConfigRef.current.repeat,
                nextPage: autoQueueConfigRef.current.nextPage || 1,
                shuffleHash: autoQueueConfigRef.current.shuffleHash
              },
              autoQueueShouldClear: true
            });
          }
        }
      }
    }
  }

  useEffect(() => {
    if (activeQueueUpcomingResources && activeQueueUpcomingResources.length > 0) {
      const nextResource = activeQueueUpcomingResources[0];
      if (nextResource?.item) {
        handleLoadQueueItem(nextResource);
      } else if (nextResource?.clip) {
        handleLoadQueueClip(nextResource);
      } else if (nextResource?.item_soundbite) {
        handleLoadQueueItemSoundbite(nextResource);
      }
    }
  }, [activeQueueUpcomingResources]);

  useEffect(() => {
    const autoQueueResources = autoQueueResourcesRef.current;
    if (autoQueueActiveRow) {
      const nextResource = autoQueueResources[autoQueueActiveRow];
      if (nextResource) {
        handleLoadAutoQueueItem(nextResource);
      }
    }
  }, [autoQueueActiveRow]);

  return (
    <>
      <MediaPlayerControllerAudio />
      <MediaPlayerVideoWrapper />
      <MediaPlayerControllerLiveStreamAudio />
      <MediaPlayerLiveStreamVideoWrapper />
    </>
  )
};
