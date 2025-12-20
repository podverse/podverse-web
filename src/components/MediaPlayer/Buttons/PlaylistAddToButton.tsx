import { FaPlus } from "react-icons/fa6"
import { useModals } from "../../../contexts/Modals"
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlaylistAddToButton.module.scss"

export const PlaylistAddToButton = () => {
  const { mpChannel, mpItem, mpClip, mpItemSoundbite } = useMediaPlayer();
  const { setModalPlaylistAddTo } = useModals();

  const onClick = () => {
    setModalPlaylistAddTo({
      channel: mpChannel,
      item: mpItem,
      clip: mpClip,
      item_soundbite: mpItemSoundbite
    });
  };

  return (
    <button
      className={styles.playlistAddToButton}
      onClick={onClick}
      type="button">
      <FaPlus />
    </button>
  )
}
