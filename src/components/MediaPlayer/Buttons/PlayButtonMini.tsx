import { useTranslations } from "next-intl";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButtonMini.module.scss"

type PlayButtonMiniProps = {
  onClick: () => void;
}

export const PlayButtonMini: React.FC<PlayButtonMiniProps> = ({ onClick }) => {
  const { mpIsPlaying } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");
  const label = mpIsPlaying ? tMediaPlayer("pause") : tMediaPlayer("play");
  const icon = mpIsPlaying ? <FaPause /> : <FaPlay />;

  return (
    <button
      className={styles.playButtonMini}
      aria-label={label}
      onClick={onClick}>
      {icon}
    </button>
  )
}
