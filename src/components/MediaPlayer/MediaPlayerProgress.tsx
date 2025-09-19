"use client";

import React from "react";
import styles from "../../styles/components/MediaPlayer/MediaPlayerProgress.module.scss";

type MediaPlayerProgressProps = {
  currentTime: number; // seconds
  duration: number;    // seconds
  onSeek?: (value: number) => void;
};

function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const MediaPlayerProgress: React.FC<MediaPlayerProgressProps> = ({
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
          background: `linear-gradient(to right, #fff ${progress * 100}%, #2196f3 ${progress * 100}%)`
        }}
        onChange={e => onSeek && onSeek(Number(e.target.value))}
      />
      <span className={styles.mediaPlayerProgressDuration}>{formatTime(duration)}</span>
    </div>
  );
};