import { FaScissors } from "react-icons/fa6"
import { useModals } from "../../../contexts/Modals"
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/PlaylistAddToButton.module.scss"

export const ClipButton = () => {
  const { mpChannel, mpItem } = useMediaPlayer();
  const { setModalClip } = useModals();

  const onClick = () => {
    setModalClip({
      channel: mpChannel,
      item: mpItem
    })
  };

  return (
    <button
      className={styles.playlistAddToButton}
      onClick={onClick}
      type="button">
      <FaScissors />
    </button>
  )
}
