import { useTranslations } from "next-intl";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButtonMini.module.scss"
import { DTOItem } from "podverse-helpers";

type PlayButtonMiniProps = {
  item: DTOItem;
  onClick: () => void;
}

export const PlayButtonMini: React.FC<PlayButtonMiniProps> = ({ item, onClick }) => {
  const { mpIsPlaying, mpItem } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");
  
  const isCurrentItem = mpItem?.id === item.id;
  const isPlaying = isCurrentItem && mpIsPlaying;
  const label = isPlaying ? tMediaPlayer("pause") : tMediaPlayer("play");
  const icon = isPlaying ? <FaPause /> : <FaPlay />;

  return (
    <button
      className={styles.playButtonMini}
      aria-label={label}
      onClick={onClick}>
      {icon}
    </button>
  )
}
