import { useTranslations } from "next-intl";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButtonRow.module.scss"
import { DTOClip, DTOItem, DTOItemSoundbite } from "podverse-helpers";

type PlayButtonRowProps = {
  item: DTOItem | null;
  item_soundbite?: DTOItemSoundbite;
  clip?: DTOClip;
  onClick: () => void;
}

export const PlayButtonRow: React.FC<PlayButtonRowProps> = ({ clip, item, onClick }) => {
  const { mpIsPlaying, mpItem, mpClip } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");

  if (!item) {
    return null;
  }
  
  let isCurrentlyInPlayer = false;
  if (clip) {
    isCurrentlyInPlayer = mpClip?.id === clip.id;
  } else if (mpItem) {
    isCurrentlyInPlayer = mpItem.id === item.id;
  }

  const isPlaying = isCurrentlyInPlayer && mpIsPlaying;
  const label = isPlaying ? tMediaPlayer("pause") : tMediaPlayer("play");
  const icon = isPlaying ? <FaPause /> : <FaPlay />;

  return (
    <button
      className={styles.playButtonRow}
      aria-label={label}
      onClick={onClick}
      type="button">
      {icon}
    </button>
  )
}
