"use client";

import React, { useRef, useEffect } from "react";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { getMediaTypeFromSource, getSelectedItemEnclosureUrl } from "podverse-helpers";
import { EVENTS } from "../../../constants/events";

// Track the stopAt time for conditional pausing
let globalPauseAtTime: number | null = null;

export const MediaPlayerControllerAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    mpClip,
    mpItem,
    mpIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
    mpIsMuted,
    setMPCurrentTime,
    setMPIsPlaying,
    setMPDuration,
    setMPClip
  } = useMediaPlayer();

  const mpClipRef = useRef<typeof mpClip>(null);
  useEffect(() => {
    mpClipRef.current = mpClip;
  }, [mpClip]);
  const {
    mpItemSoundbite,
    setMPItemSoundbite
  } = useMediaPlayer();
  
  const mpItemSoundbiteRef = useRef<typeof mpItemSoundbite>(null);
  useEffect(() => {
    mpItemSoundbiteRef.current = mpItemSoundbite;
  }, [mpItemSoundbite]);
  
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
        audio.play().catch(() => {});
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
      audio.play();

      if (mpClip.end_time) {
        globalPauseAtTime = Number(mpClip.end_time);
      }
    }

    if (mpItemSoundbite && audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = Number(mpItemSoundbite.start_time);
      audio.play();

      if (mpItemSoundbite.duration) {
        globalPauseAtTime = Number(mpItemSoundbite.start_time) + Number(mpItemSoundbite.duration);
      }
    }
  }, [mpClip, mpItemSoundbite]);

  return (
    <audio
      ref={audioRef}
      src={selectedItemEnclosureUrl}
      preload="auto"
      style={{ display: "none" }}
    />
  );
};
