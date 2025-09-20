"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { getEnclosure, getEnclosureSource } from "podverse-helpers";

export const MediaPlayerControllerAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const {
    mpItem,
    mpIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
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

  useMediaPlayerAudioEffects({
    audioRef,
    mpIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
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
  setMPCurrentTime: (time: number) => void;
  setMPDuration: (duration: number) => void;
}

function useMediaPlayerAudioEffects({
  audioRef,
  mpIsPlaying,
  mpPlaybackSpeed,
  mpVolume,
  setMPCurrentTime,
  setMPDuration
}: MediaPlayerAudioEffectsProps): void {
  // Time update and metadata loaded
  useEffect(() => {    
    const audio = audioRef?.current;
    if (!audio) return;

    let lastUpdate = 0;
    const handleTimeUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate > 500) {
        setMPCurrentTime(audio.currentTime);
        lastUpdate = now;
      }
    };

    const handleLoadedMetadata = () => setMPDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioRef, setMPCurrentTime, setMPDuration]);

  // Play/Pause
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    if (mpIsPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [mpIsPlaying, audioRef]);

  // Volume
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    audio.volume = mpVolume;
  }, [mpVolume, audioRef]);

  // Playback speed
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    audio.playbackRate = mpPlaybackSpeed;
  }, [mpPlaybackSpeed, audioRef]);
}
