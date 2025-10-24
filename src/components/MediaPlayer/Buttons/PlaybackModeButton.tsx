import classNames from "classnames";
import { FaInfinity } from "react-icons/fa6"
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlaybackMode.module.scss";

export const PlaybackModeButton = () => {
  const { mpPlaybackMode, setMPPlaybackMode } = useMediaPlayer();

  const onClick = () => {
    const newMode = mpPlaybackMode === "autoplay-next" ? "stop-at-end" : "autoplay-next";
    setMPPlaybackMode(newMode);
  };

  return (
    <button
      className={classNames(styles.playbackModeButton, {
        [styles.active]: mpPlaybackMode === "autoplay-next"
      })}
      onClick={onClick}
      type="button">
      <FaInfinity />
    </button>
  )
}
