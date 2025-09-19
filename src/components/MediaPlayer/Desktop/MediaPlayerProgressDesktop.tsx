"use client";

import React from "react";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerProgressDesktop.module.scss";

type MediaPlayerProgressDesktopProps = {
  currentTime: number;
  duration: number;
  onSeek?: (value: number) => void;
};

function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const MediaPlayerProgressDesktop: React.FC<MediaPlayerProgressDesktopProps> = ({
  currentTime,
  duration,
  onSeek
}) => {
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className={styles.mediaPlayerProgress}>
      <span className={styles.mediaPlayerProgressTime}>{formatTime(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        step={1}
        className={styles.mediaPlayerProgressSlider}
        style={{
          background: `linear-gradient(to right, #ff0000 ${progress * 100}%, #00c853 ${progress * 100}%)`
        }}
        onChange={e => onSeek && onSeek(Number(e.target.value))}
      />
      <span className={styles.mediaPlayerProgressDuration}>{formatTime(duration)}</span>
    </div>
  );
};