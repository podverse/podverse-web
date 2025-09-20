"use client";

import React, { useRef } from "react";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerProgressDesktop.module.scss";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";

function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const MediaPlayerProgressDesktop: React.FC = () => {
  const { mpCurrentTime, mpDuration } = useMediaPlayer();
  const barRef = useRef<HTMLDivElement>(null);
  const progress = mpDuration > 0 ? mpCurrentTime / mpDuration : 0;

  const setProgressFromEvent = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || mpDuration === 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = (e instanceof MouseEvent ? e.clientX : e.nativeEvent.clientX) - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    // handle seek Math.round(percent * mpDuration);
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setProgressFromEvent(e);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setProgressFromEvent(e);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setProgressFromEvent(moveEvent);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={styles.mediaPlayerProgress}>
      <span className={styles.mediaPlayerProgressTime}>{formatTime(mpCurrentTime)}</span>
      <div
        className={styles.customProgressBar}
        ref={barRef}
        onClick={handleBarClick}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-valuenow={mpCurrentTime}
        aria-valuemin={0}
        aria-valuemax={mpDuration}
        aria-valuetext={`${formatTime(mpCurrentTime)} of ${formatTime(mpDuration)}`}
        tabIndex={0}
      >
        <div
          className={styles.progressLevel}
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className={styles.progressRemaining}
          style={{ width: `${(1 - progress) * 100}%` }}
        />
      </div>
      <span className={styles.mediaPlayerProgressDuration}>{formatTime(mpDuration)}</span>
    </div>
  );
};