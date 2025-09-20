"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { getEnclosure, getEnclosureSource } from "podverse-helpers";

export const MediaPlayerController: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const {
    mpItem,
    mpIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
    setMPCurrentTime,
    setMPDuration
  } = useMediaPlayer();

  const selectedItemEnclosure = getEnclosure(mpItem?.item_enclosures || [], "default");
  const selectedItemEnclosureSource = getEnclosureSource(selectedItemEnclosure);
  const selectedItemEnclosureUrl = selectedItemEnclosureSource?.uri;

  useEffect(() => {
    if (selectedItemEnclosureUrl && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [selectedItemEnclosureUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setMPCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setMPDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  useAudioEffect((audio) => {
    mpIsPlaying ? audio.play() : audio.pause();
  }, [mpIsPlaying], audioRef);

  useAudioEffect((audio) => {
    audio.volume = mpVolume;
  }, [mpVolume], audioRef);

  useAudioEffect((audio) => {
    audio.playbackRate = mpPlaybackSpeed;
  }, [mpPlaybackSpeed], audioRef);

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

function useAudioEffect(
  effect: (audio: HTMLAudioElement) => void,
  deps: React.DependencyList,
  audioRef: React.RefObject<HTMLAudioElement | null>
) {
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    effect(audio);
  }, deps);
}
