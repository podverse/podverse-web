"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { getEnclosure, getEnclosureSource } from "podverse-helpers";
import { EVENTS } from "../../../constants/events";

export const MediaPlayerControllerAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const {
    mpItem,
    mpIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
    mpIsMuted,
    setMPCurrentTime,
    setMPDuration
  } = useMediaPlayer();

  const selectedItemEnclosure = getEnclosure(mpItem?.item_enclosures ?? [], "default");
  const selectedItemEnclosureSource = getEnclosureSource(selectedItemEnclosure);
  const selectedItemEnclosureUrl = selectedItemEnclosureSource?.uri;

  useEffect(() => {
    if (selectedItemEnclosureUrl && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [selectedItemEnclosureUrl, hasLoadedOnce]);

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

    window.addEventListener(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, handleSeek);
    window.addEventListener(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_BACK, handleJumpBack);
    window.addEventListener(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_FORWARD, handleJumpForward);

    return () => {
      window.removeEventListener(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, handleSeek);
      window.removeEventListener(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_BACK, handleJumpBack);
      window.removeEventListener(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_FORWARD, handleJumpForward);
    };
  }, []);

  useMediaPlayerAudioEffects({
    audioRef,
    mpIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
    mpIsMuted,
    setMPCurrentTime,
    setMPDuration
  });

  return (
    <audio
      ref={audioRef}
      src={selectedItemEnclosureUrl}
      preload="auto"
      style={{ display: "none" }}
      autoPlay={hasLoadedOnce}
    />
  );
};

interface MediaPlayerAudioEffectsProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  mpIsPlaying: boolean;
  mpPlaybackSpeed: number;
  mpVolume: number;
  mpIsMuted: boolean;
  setMPCurrentTime: (time: number) => void;
  setMPDuration: (duration: number) => void;
}

function useMediaPlayerAudioEffects({
  audioRef,
  mpIsPlaying,
  mpPlaybackSpeed,
  mpVolume,
  mpIsMuted,
  setMPCurrentTime,
  setMPDuration
}: MediaPlayerAudioEffectsProps): void {
  // Time update and metadata loaded
  useEffect(() => {    
    const audio = audioRef?.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setMPCurrentTime(audio.currentTime);
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
}
