"use client";

import { DTOClip, formatHHMMSS } from "podverse-helpers";
import React, { useRef } from "react";
import { EVENTS } from "../../../constants/events";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import styles from "../../../styles/components/MediaPlayer/Sliders/MediaPlayerProgress.module.scss";

type MediaPlayerProgressProps = {
  isClipForm?: boolean;
  overrideHighlightStartTime?: number | null;
  overrideHighlightEndTime?: number | null;
  includeMobileTime?: boolean;
};

export const MediaPlayerProgress: React.FC<MediaPlayerProgressProps> = ({
  isClipForm,
  overrideHighlightStartTime,
  overrideHighlightEndTime,
  includeMobileTime
}) => {
  const { mpClip, mpItemSoundbite, mpItemChapter, mpDuration } = useMediaPlayer();
  const { mpCurrentTime } = useMediaPlayerCurrentTime();
  const barRef = useRef<HTMLDivElement>(null);
  const progress = mpDuration > 0 ? mpCurrentTime / mpDuration : 0;

  const { highlightStartPosition, highlightEndPosition } = getHighlightPositions({
    mpDuration,
    isClipForm,
    overrideHighlightStartTime,
    overrideHighlightEndTime,
    mpClip,
    mpItemSoundbite,
    mpItemChapter
  });

  const setProgressFromEvent = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || mpDuration === 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = (e instanceof MouseEvent ? e.clientX : e.nativeEvent.clientX) - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    const newTime = Math.round(percent * mpDuration);
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.SEEK, { detail: { time: newTime } }));
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
        <div className={styles.customProgressBarInner}>
          <div
            className={styles.progressLevel}
            style={{ width: `${progress * 100}%` }}
          />
          <div
            className={styles.progressRemaining}
            style={{ width: `${(1 - progress) * 100}%` }}
          />
        </div>
        {
          (highlightStartPosition !== null && highlightEndPosition !== null) && (
            <div
              className={styles.highlightedSection}
              style={{
                left: `${highlightStartPosition * 100}%`,
                width: `${(highlightEndPosition - highlightStartPosition) * 100}%`
              }}
            />
          )
        }
      </div>
      <span className={styles.mediaPlayerProgressDuration}>{formatHHMMSS(mpDuration)}</span>
      {
        includeMobileTime && (
          <div className={styles.mobileTimeWrapper}>
            <span className={styles.mediaPlayerProgressTimeMobile}>{formatHHMMSS(mpCurrentTime)}</span>
            <span className={styles.mediaPlayerProgressDurationMobile}>{formatHHMMSS(mpDuration)}</span>
          </div>
        )
      }
    </div>
  );
};

function getHighlightPositions({
  mpDuration,
  isClipForm,
  overrideHighlightStartTime,
  overrideHighlightEndTime,
  mpClip,
  mpItemSoundbite,
  mpItemChapter
}: {
  mpDuration?: number,
  isClipForm?: boolean,
  overrideHighlightStartTime?: number | null,
  overrideHighlightEndTime?: number | null,
  mpClip?: DTOClip | null,
  mpItemSoundbite?: { start_time: string | number, duration: string | number } | null,
  mpItemChapter?: { start_time: string | number, end_time?: string | number | null } | null
}) {
  let highlightStartPosition = null;
  let highlightEndPosition = null;
  if (mpDuration) {
    if (isClipForm) {
      if (overrideHighlightStartTime || overrideHighlightStartTime === 0) {
        highlightStartPosition = overrideHighlightStartTime / mpDuration;
      }
      if (overrideHighlightEndTime) {
        highlightEndPosition = overrideHighlightEndTime / mpDuration;
      }
    } else if (mpItemSoundbite) {
      const soundbiteStart = Number(mpItemSoundbite.start_time);
      const soundbiteDuration = Number(mpItemSoundbite.duration);
      if (!isNaN(soundbiteStart)) {
        highlightStartPosition = soundbiteStart / mpDuration;
      }
      if (!isNaN(soundbiteStart) && !isNaN(soundbiteDuration)) {
        highlightEndPosition = (soundbiteStart + soundbiteDuration) / mpDuration;
      }
    } else if (mpItemChapter) {
      const chapterStart = Number(mpItemChapter.start_time);
      const chapterEnd = mpItemChapter.end_time != null ? Number(mpItemChapter.end_time) : null;
      if (!isNaN(chapterStart)) {
        highlightStartPosition = chapterStart / mpDuration;
      }
      if (chapterEnd !== null && !isNaN(chapterEnd)) {
        highlightEndPosition = chapterEnd / mpDuration;
      }
    } else {
      const clipStartTime = Number(mpClip?.start_time);
      const clipEndTime = Number(mpClip?.end_time);
      if (clipStartTime || clipStartTime === 0) {
        highlightStartPosition = clipStartTime / mpDuration;
      }
      if (clipEndTime) {
        highlightEndPosition = clipEndTime / mpDuration;
      }
    }
  }
  return { highlightStartPosition, highlightEndPosition };
}
