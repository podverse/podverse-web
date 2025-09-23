import { useTranslations } from "next-intl";
import { getNextPlaybackSpeed, getPlaybackTranslationKey } from "podverse-helpers";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlaybackSpeedButton.module.scss"

export const PlaybackSpeedButton = () => {
  const tMediaPlayer = useTranslations("media_player");
  const { mpPlaybackSpeed, setMPPlaybackSpeed } = useMediaPlayer();

  const onClick = () => {
    setMPPlaybackSpeed(getNextPlaybackSpeed(mpPlaybackSpeed));
  };

  return (
    <button
      className={styles.playbackSpeedButton}
      onClick={onClick}
      type="button">
      {tMediaPlayer(`playback_speed.speeds.${getPlaybackTranslationKey(mpPlaybackSpeed)}`)}
    </button>
  )
}
