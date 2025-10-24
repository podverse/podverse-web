"use client";

import { getMediaTypeFromSource, getSelectedItemEnclosureUrl } from "podverse-helpers";
import React, { useRef, useEffect } from "react";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { EVENTS } from "../../../constants/events";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import { useQueueResourcesUpdateNowPlaying } from "../../../hooks/useQueueResourceUpdateNowPlaying";
import { useQueueResourcesMoveNowPlayingToHistory } from "../../../hooks/useQueueResourceMoveNowPlayingToHistory";
import { useQueueResourcesLoadActive } from "../../../hooks/useQueueResourcesLoadActive";

// Track the stopAt time for conditional pausing
let globalPauseAtTime: number | null = null;

export const MediaPlayerControllerAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    mpClip, setMPClip,
    mpItem,
    mpItemChapter, setMPItemChapter,
    mpItemChapters,
    mpItemChapterShouldSeek, setMPItemChapterShouldSeek,
    mpItemSoundbite, setMPItemSoundbite,
    mpIsPlaying, setMPIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
    mpIsMuted,
    mpShouldPlay, setMPShouldPlay,
    setMPDuration
  } = useMediaPlayer();

  const { setMPCurrentTime } = useMediaPlayerCurrentTime();
  const updateNowPlaying = useQueueResourcesUpdateNowPlaying();
  const moveNowPlayingToHistory = useQueueResourcesMoveNowPlayingToHistory();
  const queueResourcesLoadActive = useQueueResourcesLoadActive();

  const playbackElapsedRef = useRef(0);
  const lastPlaybackTimeRef = useRef<number | null>(null);

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

  const selectedItemEnclosureUrl = getSelectedItemEnclosureUrl(mpItem?.item_enclosures ?? []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && selectedItemEnclosureUrl) {
      const isAudioFile = getMediaTypeFromSource(selectedItemEnclosureUrl) === "audio";
      if (isAudioFile) {
        audio.load();
        if (mpShouldPlay) {
          audio.play().catch(() => {});
          setMPShouldPlay(false);
        }
      } else {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    }
  }, [selectedItemEnclosureUrl]);
  
  // Event listeners
  useEffect(() => {    
    const audio = audioRef?.current;
    if (!audio) return;
    
    const handleLoadedMetadata = () => {
      setMPDuration(audio.duration)
      setTimeout(() => {
        updateNowPlaying();
      }, 0);
    };
    
    const handlePlay = () => {
      if (audio.currentTime < audio.duration) {
        updateNowPlaying(); 
        playbackElapsedRef.current = 0;
        lastPlaybackTimeRef.current = audio.currentTime;
      }
    };
    
    const handlePause = () => {
      if (audio.currentTime < audio.duration) {
        updateNowPlaying();
        playbackElapsedRef.current = 0;
        lastPlaybackTimeRef.current = null;
      }
    };

    const handleTimeUpdate = () => {
      setMPCurrentTime(audio.currentTime);

      if (lastPlaybackTimeRef.current !== null) {
        const delta = audio.currentTime - lastPlaybackTimeRef.current;
        if (delta > 0) {
          playbackElapsedRef.current += delta;
        }
      }
      lastPlaybackTimeRef.current = audio.currentTime;

      if (playbackElapsedRef.current >= 15) {
        updateNowPlaying();
        playbackElapsedRef.current = 0;
      }

      if (globalPauseAtTime !== null && audio.currentTime >= globalPauseAtTime) {
        setMPIsPlaying(false);
        globalPauseAtTime = null;
      }

      const clip = mpClipRef.current;
      if (clip && clip.end_time) {
        const endTimeNum = typeof clip.end_time === "string" ? parseFloat(clip.end_time) : clip.end_time;
        const endTimeNumAdjusted = endTimeNum + 1;
        if (!isNaN(endTimeNumAdjusted) && audio.currentTime >= endTimeNumAdjusted) {
          moveNowPlayingToHistory();
          setMPClip(null);
          updateNowPlaying();
        }
      }

      const itemSoundbite = mpItemSoundbiteRef.current;
      if (itemSoundbite && itemSoundbite.duration) {
        const startNum = typeof itemSoundbite.start_time === "string" ? parseFloat(itemSoundbite.start_time) : itemSoundbite.start_time;
        const durationNum = typeof itemSoundbite.duration === "string" ? parseFloat(itemSoundbite.duration) : itemSoundbite.duration;
        const endTimeNum = startNum + durationNum;
        const endTimeNumAdjusted = endTimeNum + 1;
        if (!isNaN(endTimeNumAdjusted) && audio.currentTime >= endTimeNumAdjusted) {
          moveNowPlayingToHistory();
          setMPItemSoundbite(null);
          updateNowPlaying();
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

    const handleEnded = async () => {
      await moveNowPlayingToHistory();
      setMPShouldPlay(true);
      await queueResourcesLoadActive();
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
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
