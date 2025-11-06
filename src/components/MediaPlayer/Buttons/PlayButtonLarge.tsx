import { useTranslations } from "next-intl";
import { DTOClip, DTOItem } from "podverse-helpers";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButtonLarge.module.scss"

type PlayButtonLargeProps = {
  clip?: DTOClip;
  item?: DTOItem;
  onClick: () => void;
}

export const PlayButtonLarge: React.FC<PlayButtonLargeProps> = ({ clip, item, onClick }) => {
  const { mpIsPlaying, mpItem, mpClip, mpItemSoundbite } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");
  
  let isCurrentlyInPlayer = false;
  if (clip) {
    isCurrentlyInPlayer = mpClip?.id_text === clip.id_text;
  } else if (item && !mpClip && !mpItemSoundbite) {
    isCurrentlyInPlayer = mpItem?.id === item.id;
  }

  const isPlaying = isCurrentlyInPlayer && mpIsPlaying;
  const label = isPlaying ? tMediaPlayer("pause") : tMediaPlayer("play");
  const icon = isPlaying ? <FaPause /> : <FaPlay />;

  return (
    <button
      className={styles.playButtonLarge}
      aria-label={label}
      onClick={onClick}
      type="button">
      {icon}
    </button>
  )
}
