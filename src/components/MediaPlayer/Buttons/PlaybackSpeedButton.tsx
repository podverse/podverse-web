import { useTranslations } from "next-intl";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/JumpBackButton.module.scss"
import { getNextPlaybackSpeed, getPlaybackTranslationKey } from "podverse-helpers";

export const PlaybackSpeedButton = () => {
  const tMediaPlayer = useTranslations("media_player");
  const { mpPlaybackSpeed, setMPPlaybackSpeed } = useMediaPlayer();

  const onClick = () => {
    setMPPlaybackSpeed(getNextPlaybackSpeed(mpPlaybackSpeed));
  };

  return (
    <button
      className={styles.playbackSpeedButton}
      onClick={onClick}>
      {tMediaPlayer(`playback_speed.speeds.${getPlaybackTranslationKey(mpPlaybackSpeed)}`)}
    </button>
  )
}
