import { useTranslations } from "next-intl";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from "podverse-helpers";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButtonRow.module.scss"

type PlayButtonRowProps = {
  clip?: DTOClip;
  item: DTOItem | null;
  item_soundbite?: DTOItemSoundbite;
  item_chapter?: DTOItemChapter;
  onClick: () => void;
}

export const PlayButtonRow: React.FC<PlayButtonRowProps> = ({
  clip, item, item_chapter, item_soundbite, onClick }) => {
  const { mpIsPlaying, mpItem, mpItemChapter, mpItemSoundbite, mpClip } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");

  if (!item) {
    return null;
  }
  
  let isCurrentlyInPlayer = false;
  if (item_chapter) {
    isCurrentlyInPlayer = mpItemChapter?.id_text === item_chapter.id_text;
  } else if (item_soundbite) {
    isCurrentlyInPlayer = mpItemSoundbite?.id_text === item_soundbite.id_text;
  } else if (clip) {
    isCurrentlyInPlayer = mpClip?.id_text === clip.id_text;
  } else if (mpItem) {
    isCurrentlyInPlayer = mpItem.id_text === item.id_text;
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
