import React, { useRef } from "react";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Sliders/VolumeSlider.module.scss";

export const VolumeSlider: React.FC = () => {
  const { mpVolume, setMPVolume, mpIsMuted, setMPIsMuted } = useMediaPlayer();
  const barRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const setVolumeFromEvent = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = (e instanceof MouseEvent ? e.clientX : e.nativeEvent.clientX) - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    setMPVolume(Number(percent.toFixed(2)));
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setVolumeFromEvent(e);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setMPIsMuted(false);
    isDragging.current = true;
    setVolumeFromEvent(e);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isDragging.current) {
        setVolumeFromEvent(moveEvent);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setMPIsMuted(false);
      setMPVolume(Math.max(0, Number((mpVolume - 0.05).toFixed(2))));
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      setMPIsMuted(false);
      setMPVolume(Math.min(1, Number((mpVolume + 0.05).toFixed(2))));
      e.preventDefault();
    }
  };

  return (
    <div className={styles.volumeSliderWrapper}>
      <div
        className={styles.customVolumeBar}
        ref={barRef}
        onClick={handleBarClick}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-valuenow={mpIsMuted ? 0 : mpVolume}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuetext={mpIsMuted ? "Muted" : `${Math.round(mpVolume * 100)}%`}
        tabIndex={0}
      >
        <div
          className={styles.volumeLevel}
          style={{ width: `${mpIsMuted ? 0 : mpVolume * 100}%` }}
        />
        <div
          className={styles.volumeRemaining}
          style={{ width: `${mpIsMuted ? 100 : (1 - mpVolume) * 100}%` }}
        />
      </div>
    </div>
  );
};
