"use client";

import React, { useEffect } from "react";
import { MediaPlayerControllerAudio } from "./MediaPlayerControllerAudio";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { EVENTS } from "../../../constants/events";

export const MediaPlayerController: React.FC = () => {
  const { mpCurrentTime, mpDuration } = useMediaPlayer();

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

  return (
    <MediaPlayerControllerAudio />
  )
};
