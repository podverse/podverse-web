"use client";

import React, { useRef } from "react";
import styles from "../../../styles/components/MediaPlayer/Desktop/MediaPlayerProgressDesktop.module.scss";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { EVENTS } from "../../../constants/events";
import { formatHHMMSS } from "podverse-helpers";

export const MediaPlayerProgressDesktop: React.FC = () => {
  const { mpCurrentTime, mpDuration } = useMediaPlayer();
  const barRef = useRef<HTMLDivElement>(null);
  const progress = mpDuration > 0 ? mpCurrentTime / mpDuration : 0;

  const setProgressFromEvent = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || mpDuration === 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = (e instanceof MouseEvent ? e.clientX : e.nativeEvent.clientX) - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    const newTime = Math.round(percent * mpDuration);
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, { detail: { time: newTime } }));
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
      <span className={styles.mediaPlayerProgressTime}>{formatHHMMSS(mpCurrentTime)}</span>
      <div
        className={styles.customProgressBar}
        ref={barRef}
        onClick={handleBarClick}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-valuenow={mpCurrentTime}
        aria-valuemin={0}
        aria-valuemax={mpDuration}
        aria-valuetext={`${formatHHMMSS(mpCurrentTime)} of ${formatHHMMSS(mpDuration)}`}
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
      <span className={styles.mediaPlayerProgressDuration}>{formatHHMMSS(mpDuration)}</span>
    </div>
  );
};