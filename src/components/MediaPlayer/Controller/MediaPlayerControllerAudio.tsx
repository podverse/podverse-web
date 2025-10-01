"use client";

import React, { useRef, useEffect } from "react";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { DTOQueueResource, getMediaTypeFromSource, getSelectedItemEnclosureUrl, hhmmssToSecondsNumber } from "podverse-helpers";
import { EVENTS } from "../../../constants/events";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import { useQueues } from "../../../contexts/Queue";
import { apiRequestService } from "../../../factories/apiRequestService";

// Track the stopAt time for conditional pausing
let globalPauseAtTime: number | null = null;

export const MediaPlayerControllerAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    mpClip,
    mpItem,
    mpItemChapter,
    mpItemChapters,
    mpItemChapterShouldSeek,
    mpItemSoundbite,
    mpIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
    mpIsMuted,
    mpShouldPlay,
    setMPIsPlaying,
    setMPDuration,
    setMPChannel,
    setMPItem,
    setMPItemChapter,
    setMPItemChapterShouldSeek,
    setMPClip,
    setMPItemSoundbite,
    setMPShouldPlay
  } = useMediaPlayer();

  const { activeQueueUpcomingResources } = useQueues();
  const { setMPCurrentTime } = useMediaPlayerCurrentTime();

  const mpClipRef = useRef<typeof mpClip>(null);
  useEffect(() => {
    mpClipRef.current = mpClip;
  }, [mpClip]);

  const mpItemSoundbiteRef = useRef<typeof mpItemSoundbite>(null);
  useEffect(() => {
    mpItemSoundbiteRef.current = mpItemSoundbite;
  }, [mpItemSoundbite]);

  const mpItemChapterRef = useRef<typeof mpItemChapter>(null);
  useEffect(() => {
    mpItemChapterRef.current = mpItemChapter;
  }, [mpItemChapter]);

  const mpItemChaptersRef = useRef<typeof mpItemChapters>(null);
  useEffect(() => {
    mpItemChaptersRef.current = mpItemChapters;
  }, [mpItemChapters]);

  useEffect(() => {
    const handleSeek = (e: Event) => {
      const customEvent = e as CustomEvent<{ time: number }>;
      if (audioRef.current && typeof customEvent.detail.time === "number") {
        audioRef.current.currentTime = customEvent.detail.time;
      }
    };

    const handleJumpBack = (e: Event) => {
      const customEvent = e as CustomEvent<{ seconds: number }>;
      if (audioRef.current && typeof customEvent.detail.seconds === "number") {
        audioRef.current.currentTime = Math.max(audioRef.current.currentTime - customEvent.detail.seconds, 0);
      }
    };

    const handleJumpForward = (e: Event) => {
      const customEvent = e as CustomEvent<{ seconds: number }>;
      if (
        audioRef.current &&
        typeof customEvent.detail.seconds === "number" &&
        typeof audioRef.current.duration === "number"
      ) {
        audioRef.current.currentTime = Math.min(
          audioRef.current.currentTime + customEvent.detail.seconds,
          audioRef.current.duration
        );
      }
    };

    const handlePauseAt = (e: Event) => {
      const customEvent = e as CustomEvent<{ stopAt: number }>;
      if (typeof customEvent.detail.stopAt === "number") {
        globalPauseAtTime = customEvent.detail.stopAt;
      }
    };

    window.addEventListener(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, handleSeek);
    window.addEventListener(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_BACK, handleJumpBack);
    window.addEventListener(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_FORWARD, handleJumpForward);
    window.addEventListener(EVENTS.MEDIA_PLAYER.AUDIO.PAUSE_AT, handlePauseAt);

    return () => {
      window.removeEventListener(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, handleSeek);
      window.removeEventListener(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_BACK, handleJumpBack);
      window.removeEventListener(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_FORWARD, handleJumpForward);
      window.removeEventListener(EVENTS.MEDIA_PLAYER.AUDIO.PAUSE_AT, handlePauseAt);
    };
  }, []);

  useEffect(() => {
    async function handleLoadQueueItem(firstResource: DTOQueueResource) {
      if (firstResource?.item && firstResource?.item?.id_text !== mpItem?.id_text) {
        const fullItem = await apiRequestService.reqItemGetByIdOrIdText(firstResource.item.id_text);
        if (fullItem) {
          const fullChannel = await apiRequestService.reqChannelGetByIdOrIdText(fullItem.channel_id);
          if (fullChannel) {
            setMPItem(fullItem);
            setMPChannel(fullChannel);
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
              setMPClip(firstResource.clip);
              setMPItem(fullItem);
              setMPChannel(fullChannel);
            }
          }
        }
      }
    }

    async function handleLoadQueueItemChapter(firstResource: DTOQueueResource) {
      if (firstResource?.item_chapter && firstResource?.item_chapter?.id_text !== mpItemChapter?.id_text) {
        const fullItemChapter = await apiRequestService.reqItemChapterGetByIdText(
          firstResource.item_chapter.id_text
        );
        if (fullItemChapter?.item_chapters_feed?.item) {
          const fullItem = await apiRequestService.reqItemGetByIdOrIdText(fullItemChapter.item_chapters_feed.item.id_text);
          if (fullItem) {
            const fullChannel = await apiRequestService.reqChannelGetByIdOrIdText(fullItem.channel_id);
            if (fullChannel) {
              window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, {
                detail: { time: hhmmssToSecondsNumber(fullItemChapter.start_time) }
              }));
              
              setMPItem(fullItem);
              setMPChannel(fullChannel);
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
              setMPItemSoundbite(fullItemSoundbite);
              setMPItem(fullItem);
              setMPChannel(fullChannel);
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
      } else if (firstResource?.item_chapter) {
        handleLoadQueueItemChapter(firstResource);
      } else if (firstResource?.item_soundbite) {
        handleLoadQueueItemSoundbite(firstResource);
      }
    }
  }, [activeQueueUpcomingResources]);

  const selectedItemEnclosureUrl = getSelectedItemEnclosureUrl(mpItem?.item_enclosures ?? []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && selectedItemEnclosureUrl) {
      const isAudioFile = getMediaTypeFromSource(selectedItemEnclosureUrl) === "audio";
      if (isAudioFile) {
        audio.load();
        if (mpShouldPlay) {
          audio.play().catch(() => {});
        }
      } else {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    }
  }, [selectedItemEnclosureUrl]);
  
  // Time update and metadata loaded
  useEffect(() => {    
    const audio = audioRef?.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setMPCurrentTime(audio.currentTime);

      if (globalPauseAtTime !== null && audio.currentTime >= globalPauseAtTime) {
        setMPIsPlaying(false);
        globalPauseAtTime = null;
      }

      const clip = mpClipRef.current;
      if (clip && clip.end_time) {
        const endTimeNum = typeof clip.end_time === "string" ? parseFloat(clip.end_time) : clip.end_time;
        const endTimeNumAdjusted = endTimeNum + 1;
        if (!isNaN(endTimeNumAdjusted) && audio.currentTime >= endTimeNumAdjusted) {
          setMPClip(null);
        }
      }

      const itemSoundbite = mpItemSoundbiteRef.current;
      if (itemSoundbite && itemSoundbite.duration) {
        const startNum = typeof itemSoundbite.start_time === "string" ? parseFloat(itemSoundbite.start_time) : itemSoundbite.start_time;
        const durationNum = typeof itemSoundbite.duration === "string" ? parseFloat(itemSoundbite.duration) : itemSoundbite.duration;
        const endTimeNum = startNum + durationNum;
        const endTimeNumAdjusted = endTimeNum + 1;
        if (!isNaN(endTimeNumAdjusted) && audio.currentTime >= endTimeNumAdjusted) {
          setMPItemSoundbite(null);
        }
      }

      // --- Chapter auto-selection logic ---
      const chapters = mpItemChaptersRef.current;
      if (
        !mpItemSoundbiteRef.current &&
        !mpClipRef.current &&
        Array.isArray(chapters) &&
        chapters.length > 0
      ) {
        const currentTime = audio.currentTime;
        // Find all chapters that contain the current time
        const matchingChapters = chapters.filter(ch => {
          const start = typeof ch.start_time === "string" ? parseFloat(ch.start_time) : ch.start_time;
          const end = typeof ch.end_time === "string" ? parseFloat(ch.end_time) : ch.end_time;
          if (typeof start !== "number" || typeof end !== "number" || start == null || end == null) return false;
          if (isNaN(start) || isNaN(end)) return false;
          return currentTime >= start && currentTime < end;
        });
        // If any, prefer table_of_contents: false
        let selectedChapter = null;
        if (matchingChapters.length > 0) {
          selectedChapter = matchingChapters.find(ch => ch.table_of_contents === false) || matchingChapters[0];
        }
        // If found and not already selected, set as mpItemChapter
        if (selectedChapter) {
          if (!mpItemChapterRef.current || mpItemChapterRef.current.id_text !== selectedChapter.id_text) {
            setMPItemChapter(selectedChapter);
          }
        }
      }
      // --- End chapter auto-selection logic ---
    };

    const handleLoadedMetadata = () => setMPDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioRef]);

  // Play/Pause
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    if (mpIsPlaying) {
      audio.play().catch(() => {});
      setMPShouldPlay(false);
    } else {
      audio.pause();
    }
  }, [mpIsPlaying]);

  // Volume
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    audio.volume = mpVolume;
  }, [mpVolume]);

  // Mute / Unmute
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    audio.muted = mpIsMuted;
  }, [mpIsMuted]);

  // Playback speed
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    audio.playbackRate = mpPlaybackSpeed;
  }, [mpPlaybackSpeed]);

  useEffect(() => {
    if (mpClip && audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = Number(mpClip.start_time);

      if (mpShouldPlay) {
        audio.play();
        setMPShouldPlay(false);
      }

      if (mpClip.end_time) {
        globalPauseAtTime = Number(mpClip.end_time);
      }
    }

    if (mpItemChapter && audioRef.current) {
      if (mpItemChapterShouldSeek) {
        setMPItemChapterShouldSeek(false);
        const audio = audioRef.current;
        audio.currentTime = Number(mpItemChapter.start_time);

        if (mpShouldPlay) {
          audio.play();
          setMPShouldPlay(false);
        }
      }

      if (mpItemChapter.end_time) {
        globalPauseAtTime = null;
      }
    }

    if (mpItemSoundbite && audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = Number(mpItemSoundbite.start_time);
      if (mpShouldPlay) {
        audio.play();
        setMPShouldPlay(false);
      }

      if (mpItemSoundbite.duration) {
        globalPauseAtTime = Number(mpItemSoundbite.start_time) + Number(mpItemSoundbite.duration);
      }
    }
  }, [mpClip, mpItemChapter, mpItemSoundbite]);

  return (
    <audio
      ref={audioRef}
      src={selectedItemEnclosureUrl}
      preload="auto"
      style={{ display: "none" }}
    />
  );
};
