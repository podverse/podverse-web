"use client";

import { DTOQueueResource } from "podverse-helpers";
import React, { useEffect } from "react";
import { MediaPlayerControllerAudio } from "./MediaPlayerControllerAudio";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { EVENTS } from "../../../constants/events";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useQueues } from "../../../contexts/Queue";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";

export const MediaPlayerController: React.FC = () => {
  const { mpItem, mpClip, mpItemSoundbite, mpDuration } = useMediaPlayer();
  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { mpCurrentTime } = useMediaPlayerCurrentTime();
  const { activeQueueUpcomingResources } = useQueues();

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
      window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, { detail: { time: newTime } }));
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      const newTime = Math.min(mpDuration, mpCurrentTime + 10);
      window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, { detail: { time: newTime } }));
      e.preventDefault();
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  });

  useEffect(() => {
    async function handleLoadQueueItem(firstResource: DTOQueueResource) {
      if (firstResource?.item && firstResource?.item?.id_text !== mpItem?.id_text) {
        const fullItem = await apiRequestService.reqItemGetByIdOrIdText(firstResource.item.id_text);
        if (fullItem) {
          const fullChannel = await apiRequestService.reqChannelGetByIdOrIdText(fullItem.channel_id);
          if (fullChannel) {
            mediaPlayerResourceUpdate({
              channel: fullChannel,
              clip: null,
              item: fullItem,
              itemChapter: null,
              itemChapterShouldSeek: false,
              itemSoundbite: null
            });
          }
        }
      }
    }

    async function handleLoadQueueClip(firstResource: DTOQueueResource) {
      if (firstResource?.clip && firstResource?.clip?.id_text !== mpClip?.id_text) {
        const fullClip = await apiRequestService.reqClipGet(firstResource.clip.id_text);
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
                itemSoundbite: null
              });
            }
          }
        }
      }
    }

    async function handleLoadQueueItemSoundbite(firstResource: DTOQueueResource) {
      if (firstResource?.item_soundbite && firstResource?.item_soundbite?.id_text !== mpItemSoundbite?.id_text) {
        const fullItemSoundbite = await apiRequestService.reqItemSoundbiteGet(firstResource.item_soundbite.id_text);
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
                itemSoundbite: fullItemSoundbite
              });
            }
          }
        }
      }
    }

    if (activeQueueUpcomingResources && activeQueueUpcomingResources.length > 0) {
      const firstResource = activeQueueUpcomingResources[0];
      if (firstResource?.item) {
        handleLoadQueueItem(firstResource);
      } else if (firstResource?.clip) {
        handleLoadQueueClip(firstResource);
      } else if (firstResource?.item_soundbite) {
        handleLoadQueueItemSoundbite(firstResource);
      }
    }
  }, [activeQueueUpcomingResources]);

  return (
    <MediaPlayerControllerAudio />
  )
};
