import { FaPlus } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/PlaylistAddToButton.module.scss"
import { useModals } from "../../../contexts/Modals"
import { useMediaPlayer } from "../../../contexts/MediaPlayer";

export const PlaylistAddToButton = () => {
  const { mpChannel, mpItem, mpClip, mpChapter, mpSoundbite } = useMediaPlayer();
  const { setModalPlaylistAddTo } = useModals();

  const onClick = () => {
    setModalPlaylistAddTo({
      channel: mpChannel,
      item: mpItem,
      clip: mpClip,
      item_chapter: mpChapter,
      item_soundbite: mpSoundbite
    });
  };

  return (
    <button
      className={styles.playlistAddToButton}
      onClick={onClick}>
      <FaPlus />
    </button>
  )
}
